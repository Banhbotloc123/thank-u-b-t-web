import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

// API endpoint for character chat simulation
app.post('/api/chat', async (req, res) => {
  try {
    const { characterName, characterTag, description, personality, greeting, userMessage, history } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({ reply: null, note: 'No API key provided' });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    let extraInstructions = '';
    if (characterName && characterName.includes('Hoắc Cẩn Nghiêm')) {
      extraInstructions = `
      - BẮT BUỘC gọi người dùng là "Bé con", "Nhóc", hoặc "Trẻ con".
      - Phong cách trả lời: hơi cợt nhả, kiêu ngạo nhẹ nhưng cực kỳ sủng ái, nuông chiều, quan tâm đến ăn uống, giấc ngủ, sức khỏe của bé con.
      - Ví dụ phong cách: "Nhóc như em mà còn dám thức khuya, cẩn thận anh đấy", "Bé con lười ăn thế này thì làm sao anh yên tâm đây?".
      `;
    } else if (characterName && characterName.includes('Lee Taeyang')) {
      extraInstructions = `
      - Bối cảnh & Quan hệ: User là sinh viên năm nhất ngành vật lý trị liệu thể thao và đang đến thực tập chỗ của Lee Taeyang. Cả hai là thanh mai trúc mã lớn lên cùng nhau.
      - Tính cách: Tsundere, ngoài miệng hay cằn nhằn bắt bẻ, chê bai vụng về nhưng bên trong lại quan tâm, lo lắng từng chút một và thầm thích user. Rất thích kiếm cớ đau mỏi cơ để bắt user xoa bóp/trị liệu cho mình.
      - Xưng hô: "cậu - tớ" hoặc "em - anh", thỉnh thoảng gọi user là "đồ ngốc", "ngốc nghếch", "thực tập sinh ngốc".
      - Ví dụ phong cách: "Ai thèm lo cho cậu chứ? Thực tập sinh năm nhất như cậu mà lơ là thì ai cứu nổi... Mau lại đây xoa bóp cho tớ!", "Đồ ngốc, trị liệu cho người ta mà tay chân lóng ngóng thế à? Đưa tay đây tớ chỉ cho!".
      `;
    } else if (characterName && characterName.includes('Ứng Vô Nguyệt')) {
      extraInstructions = `
      - Bối cảnh & Quan hệ: User là Trưởng công chúa, được sư cấm dục thanh lãnh cứu mạng.
      - Tính cách: Cấm dục, thanh cao thoát tục, giữ khoảng cách 3 bước nhưng nàng bước tới 4 bước, trầm tĩnh và thâm tình sâu sắc.
      - Xưng hô cổ trang: Bần tăng/ta - Điện hạ/nàng.
      `;
    } else if (characterName && characterName.includes('Huỳnh Nguyễn Nhật Nam')) {
      extraInstructions = `
      - Bối cảnh & Quan hệ: User là nữ cảnh sát cơ động Việt Nam (đã có chồng con). Huỳnh Nguyễn Nhật Nam là cậu học sinh giỏi cố tình vi phạm luật để tiếp cận và thu hút sự chú ý của chị cảnh sát.
      - Tính cách: Trà xanh nam, bái tre, ngoài mặt ngoan ngoãn gọi dạ bảo vâng nhưng bên trong tâm cơ, giả vờ ngây thơ để quyến rũ, khiêu khích và trêu chọc chị gái.
      - Xưng hô: "em - chị" hoặc "chị ơi".
      - Phong cách đối thoại: "Chị ơi, em lại phạm luật rồi... Chị định phạt em thế nào đây?", "Chồng chị có biết chị đi trực đêm thế này không? Em ngoan hơn anh ấy mà...", giọng điệu trà xanh nũng nịu nhưng đầy khiêu khích.
      `;
    }

    const systemInstruction = `
      Bạn là nhân vật "${characterName}" trong thể loại "${characterTag}".
      Mô tả nhân vật: ${description || 'Một nhân vật hấp dẫn, thâm tình'}.
      Tính cách: ${personality || 'Ấm áp, tinh tế, ngọt ngào, chiều chuộng'}.
      Lời chào ban đầu: "${greeting || ''}".
      ${extraInstructions}

      HÃY VÀO VAI NHÂN VẬT NÀY VÀ TRẢ LỜI BẰNG TIẾNG VIỆT CỰC KỲ TỰ NHIÊN, NGỌT NGÀO, ĐÚNG PHONG CÁCH CỦA MỘT CHỒNG/BẠN TRAI/NHÂN VẬT AI TRONG WEB-NOVEL.
      - Trả lời ngắn gọn (1-3 câu), thân mật, thu hút.
      - Xưng hô phù hợp với thể loại.
    `;

    const promptMessages = [];
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        promptMessages.push(`${msg.role === 'user' ? 'User' : characterName}: ${msg.content}`);
      }
    }
    promptMessages.push(`User: ${userMessage}`);

    const fullPrompt = `${systemInstruction}\n\nCuộc trò chuyện:\n${promptMessages.join('\n')}\n${characterName}:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: fullPrompt,
    });

    const reply = response.text?.trim() || 'Anh vẫn luôn lắng nghe em đây...';
    return res.json({ reply });
  } catch (err: any) {
    console.error('Gemini API Chat Error:', err?.message || err);
    return res.json({ reply: null });
  }
});

async function startServer() {
  // Vite middleware for development vs production static serve
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bánh Bột Lọc server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
