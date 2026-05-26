import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "SmartEcommerceHub API is online." });
  });

  // Razorpay Integration
  app.post("/api/create-order", async (req, res) => {
    try {
      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        return res.status(500).json({ error: "Razorpay keys not configured." });
      }

      const { tier, customAmount } = req.body;
      let amount = 0;

      if (tier === "Pro") {
        amount = 59900; // ₹599.00 in paise
      } else if (tier === "Business") {
        amount = 149900; // ₹1499.00 in paise
      } else if (customAmount) {
        amount = customAmount;
      } else {
        return res.status(400).json({ error: "Invalid tier." });
      }

      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const options = {
        amount,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);
      res.json({ ...order, key_id: process.env.RAZORPAY_KEY_ID });
    } catch (error: any) {
      console.error("Razorpay order creation error:", error);
      res.status(500).json({ error: error.message || "Failed to create order" });
    }
  });

  app.post("/api/verify-payment", express.json(), (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      const secret = process.env.RAZORPAY_KEY_SECRET;

      if (!secret) {
        return res.status(500).json({ error: "Razorpay keys not configured." });
      }

      const hmac = crypto.createHmac("sha256", secret);
      hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
      const generated_signature = hmac.digest("hex");

      if (generated_signature === razorpay_signature) {
        res.json({ status: "success", message: "Payment verified successfully" });
      } else {
        res.status(400).json({ status: "failure", error: "Invalid signature" });
      }
    } catch (error: any) {
      console.error("Razorpay verification error:", error);
      res.status(500).json({ error: "Payment verification failed" });
    }
  });

  app.post("/api/product-research", async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key is not configured." });
      }

      const { query } = req.body;
      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } 
      });

      const systemInstruction = `You are an expert ecommerce product research AI. 
Analyze the given product query and return EXACTLY a JSON array of 4 objects representing hypothetical but realistic market data across different platforms (Amazon, Flipkart, Meesho, Myntra).
Ensure you only return valid JSON. Do not use markdown wrappers like \`\`\`json.
Each object must match this structure:
{
  "platform": "string",
  "title": "string",
  "price": "string (e.g. ₹1,299)",
  "rating": number (e.g. 4.5),
  "reviews": number,
  "discount": "string (e.g. 15%)",
  "demandScore": number (0-100),
  "competitionScore": number (0-100),
  "worthSelling": boolean
}`;

      const contents = [{ role: 'user', parts: [{ text: `Provide market analysis for: ${query}` }] }];

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents,
        config: {
          systemInstruction,
          responseMimeType: "application/json"
        }
      });

      if (!response.text) throw new Error("No response generated");

      const results = JSON.parse(response.text);
      
      // Also generate a summary recommendation
      const aiSummary = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [{ role: 'user', parts: [{ text: `Based on this market data: ${response.text}, provide a short, actionable 2-sentence recommendation for an ecommerce seller regarding the product '${query}'.` }] }]
      });

      res.json({ results, recommendation: aiSummary.text });
    } catch (error: any) {
      console.error("Product research API error:", error);
      res.status(500).json({ error: "Failed to generate research data" });
    }
  });

  // AI Assistant Chat Route
  app.post("/api/chat", async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key is not configured." });
      }

      const { message, attachments, history, mode } = req.body;
      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } 
      });

      let modeInstructions = "";
      switch(mode) {
        case "fast":
        case "quick": modeInstructions = "Respond in Fast Mode: Be extremely concise, brief, and straight to the point. No fluff."; break;
        case "deep": modeInstructions = "Respond in Deep Reasoning Mode: Provide step-by-step reasoning, highly detailed analytical breakdowns, and comprehensive logic."; break;
        case "creative": modeInstructions = "Respond in Creative Mode: Focus on brainstorming, writing, creative marketing ideas, and engaging copy."; break;
        case "research": modeInstructions = "Respond in Research Mode: Act as a meticulous researcher. Provide thorough analysis, cite potential data sources conceptually, and structure findings clearly."; break;
        case "business": modeInstructions = "Respond in Business Mode: Focus on professional strategy, ROI, B2B/B2C insights, and executive summaries."; break;
        case "code": modeInstructions = "Respond in Code Mode: Act as an expert software engineer. Provide coding help, bug fixes, and well-structured code snippets with explanations."; break;
        case "smart":
        default: modeInstructions = "Respond in Smart / Balanced Mode: Provide detailed but concise, intelligent answers. Use formatting like headings, bullet points, and tables intuitively."; break;
      }
      
      const systemInstruction = `You are a helpful, professional, and sophisticated AI Ecommerce Assistant for SmartEcommerceHub. 
Role: You act as a premium consultant (similar to ChatGPT or Claude) for ecommerce entrepreneurs.
Guidelines:
- ${modeInstructions}
- Maintain full conversation context. Remember past messages naturally. Address follow-up questions intelligently.
- Provide guidance on product research, margins, marketing, and business strategy.
- If asked "continue", "explain more", "compare that", or to summarize a previous point, do so accurately based on the history.
- Ask smart clarifying questions if an inquiry is too broad.
- You can converse in both English and Hindi seamlessly depending on the user's preference.
- Format responses beautifully. Use Headings, bullet points, numbered lists, tables, code blocks, summary boxes where appropriate.
- Avoid hallucinating fresh claims.
- You can analyze user-uploaded documents, spreadsheets, code, and images. Extract key points, read tables, and compare data.
- When generating ideas or marketing copy, be creative but realistic.`;
      
      const searchKeywords = ["latest", "today", "current", "trending", "best", "price", "news", "update", "market", "research"];
      const needsSearch = searchKeywords.some(keyword => message.toLowerCase().includes(keyword));
      
      const config: any = { systemInstruction };
      if (needsSearch) {
        config.tools = [{ googleSearch: {} }];
      }

      // Convert attachments into Gemini parts
      const userParts: any[] = [];
      if (attachments && Array.isArray(attachments)) {
        for (const att of attachments) {
          if (att.data) {
            userParts.push({
              inlineData: {
                data: att.data,
                mimeType: att.mimeType
              }
            });
          } else if (att.text) {
            userParts.push({
              text: `\n--- File: ${att.name} ---\n${att.text}\n--- End File ---\n`
            });
          }
        }
      }
      userParts.push({ text: message });

      const contents = [
        ...history.map((h: any) => ({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] })),
        { role: 'user', parts: userParts }
      ];

      if (req.headers.accept && req.headers.accept.includes("text/event-stream")) {
        // Handle streaming
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        if (needsSearch) {
          res.write(`data: ${JSON.stringify({ status: "searching" })}\n\n`);
        } else {
          res.write(`data: ${JSON.stringify({ status: "analyzing" })}\n\n`);
        }

        const responseStream = await ai.models.generateContentStream({
          model: 'gemini-3.5-flash',
          contents,
          config
        });

        for await (const chunk of responseStream) {
          const text = chunk.text;
          const searchChunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
          let sources = [];
          if (searchChunks && searchChunks.length > 0) {
            sources = searchChunks.map((c: any) => ({
              uri: c.web?.uri,
              title: c.web?.title
            })).filter((s:any) => s.uri);
          }

          if (text) {
            res.write(`data: ${JSON.stringify({ text, sources, status: "streaming" })}\n\n`);
          }
        }
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      } else {
        // Fallback for non-streaming
        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents,
          config
        });

        res.json({ text: response.text });
      }
    } catch (error: any) {
      console.error("Chat API error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message || "Failed to generate response" });
      } else {
        res.write(`data: ${JSON.stringify({ error: error.message || "Failed to generate response" })}\n\n`);
        res.end();
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
