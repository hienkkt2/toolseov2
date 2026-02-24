import { GoogleGenAI } from "@google/genai";

const ai = null; // Removed global instance to use dynamic key

export interface SEOArticleInput {
  keyBlog: string;
  keyPhu: string;
  sanPhamLienQuan: string;
}

export const generateSEOArticle = async (input: SEOArticleInput, apiKey: string, _apiBaseUrl?: string) => {
  const ai = new GoogleGenAI({ 
    apiKey: apiKey || process.env.GEMINI_API_KEY || ""
  });
  const model = "gemini-3.1-pro-preview";
  
  const prompt = `
# 🚀 PROMPT MASTER PRO MAX – RANK MATH 100/100 – INDUSTRY DOMINATION – WORDPRESS READY
Bạn là chuyên gia SEO Google + Semantic SEO + EEAT Strategy + Conversion Copywriting với 15 năm kinh nghiệm.
Mục tiêu:
Tạo bài viết đạt 100 điểm Rank Math, tối ưu để Ranking Top Google bền vững, bao phủ semantic keyword, tăng topical authority toàn ngành, tăng time on page, tăng trust & EEAT, tối ưu search intent (informational + commercial), và tối đa hóa chuyển đổi về trang sản phẩm.
==================================================
INPUT:
KEY BLOG: ${input.keyBlog}
KEY PHỤ: ${input.keyPhu}
SẢN PHẨM LIÊN QUAN: ${input.sanPhamLienQuan}
============================
I. ĐỘ DÀI BẮT BUỘC
Tối thiểu 1800 từ
Cho phép 1800–2500 từ
Tuyệt đối không dưới 1800 từ
Nếu thiếu → tự động mở rộng bằng:
• Giải thích chuyên sâu
• Case study thực tế
• Insight chuyên gia
• Checklist kỹ thuật
• So sánh nâng cao
• FAQ mở rộng
• Phân tích sai lầm phổ biến
Không ghi số từ trong output.
============================
II. TỐI ƯU RANK MATH 100 ĐIỂM
1️⃣ SEO CƠ BẢN
KEY BLOG xuất hiện trong:
• Tiêu đề (có số: ví dụ 7, 2025, 5 bước...)
• Meta description
• 10% nội dung đầu tiên
• Ít nhất 1 H2
Mật độ KEY BLOG: 1.2% – 1.8% (không vượt 2%)
Sử dụng biến thể tự nhiên của KEY BLOG (không lặp exact match máy móc)
2️⃣ SEO NÂNG CAO
Có ít nhất:
• 1 bảng <table>
• 1 danh sách <ul>
• 1 danh sách <ol>
Có ít nhất 1 external link uy tín (dofollow, không thêm rel)
Có tối thiểu 3 internal link về SẢN PHẨM LIÊN QUAN:
• 1 link trong 30% đầu bài
• 1 link giữa bài (micro CTA)
• 1 link cuối bài (CTA chính)
Anchor đa dạng:
• 1 exact match
• 1 partial match
• 1 anchor tự nhiên / branded
Không đặt link riêng 1 dòng
Không thêm rel="nofollow"
============================
III. SEMANTIC & ENTITY OPTIMIZATION
Chèn KEY PHỤ tự nhiên vào H2, H3, nội dung và FAQ
Bao phủ cụm từ đồng nghĩa
Thêm entity ngành liên quan (tiêu chuẩn, vật liệu, cấu tạo, quy định nếu phù hợp)
Không nhồi nhét keyword
Viết tự nhiên như chuyên gia thực tế
============================
IV. FEATURED SNIPPET BLOCK
Bắt buộc có:
1 đoạn 40–60 từ trả lời trực tiếp KEY BLOG
1 danh sách bullet tóm tắt nhanh
1 bảng so sánh nếu phù hợp
============================
V. SEARCH INTENT STRATEGY
70% informational
30% commercial
Phải có phần:
So sánh giải pháp
Khi nào nên mua
Lỗi thường gặp
Khuyến nghị chuyên gia
Micro CTA giữa bài
CTA chuyển đổi cuối bài
============================
VI. EEAT & TRUST BOOSTER
Viết theo giọng chuyên gia kỹ thuật
Có insight thực tế ngành
Có phân tích thị trường
Có phần “Góc chuyên gia khuyến nghị”
Có phần “Sai lầm phổ biến khi lựa chọn”
============================
VII. TIME ON PAGE BOOSTER
Có checklist thực tế
Có bảng thông số
Có hướng dẫn từng bước
Nội dung sâu, không chung chung
============================
VIII. ĐỊNH DẠNG OUTPUT – WORDPRESS READY
Xuất HTML CHỈ chứa nội dung trong <article>
KHÔNG bao gồm:
<html>
<head>
<body>
Inline CSS
<hr>
QUY CHUẨN:
1 thẻ <h1> duy nhất
Các phần chính dùng <h2>
Phần phụ dùng <h3>
Dùng <strong> cho KEY BLOG ở lần xuất hiện quan trọng
Không giải thích ngoài nội dung bài
Không ghi số từ
============================
IX. FAQ ACCORDION BẮT BUỘC
<h2>Câu hỏi thường gặp về ${input.keyBlog}</h2>
[accordion open="true"]
[accordion-item title="Câu hỏi 1"]
Nội dung trả lời
[/accordion-item]
[accordion-item title="Câu hỏi 2"]
Nội dung trả lời
[/accordion-item]
[accordion-item title="Câu hỏi 3"]
Nội dung trả lời
[/accordion-item]
[accordion-item title="Câu hỏi 4"]
Nội dung trả lời
[/accordion-item]
[/accordion]
============================
X. MÔ TẢ NGẮN NGOÀI HTML
Sau khi kết thúc </article>, viết thêm 1 đoạn mô tả ngắn 150–160 ký tự:
Chứa KEY BLOG
Tối ưu CTR
Có yếu tố lợi ích / giải pháp
Không HTML
Không emoji
Không hashtag
Không xuống dòng
============================
QUAN TRỌNG
Không giải thích prompt
Không nói về SEO trong nội dung
Chỉ xuất bài viết hoàn chỉnh
Bắt đầu viết bài.
  `;

  const result = await ai.models.generateContent({
    model: model,
    contents: [{ parts: [{ text: prompt }] }],
  });

  return result.text;
};

export const generateKeywordCluster = async (keyChinh: string, apiKey: string, _apiBaseUrl?: string) => {
  const ai = new GoogleGenAI({ 
    apiKey: apiKey || process.env.GEMINI_API_KEY || ""
  });
  const model = "gemini-3.1-pro-preview";
  
  const prompt = `
Bạn là chuyên gia SEO Google + SEO Ecommerce + SEO Marketing với 15 năm kinh nghiệm.
Nhiệm vụ:
Từ KEY CHÍNH tôi cung cấp, hãy xây dựng bộ keyword cluster hoàn chỉnh để SEO và bán hàng.
Mục tiêu:
tăng traffic organic
bao phủ semantic keyword
xây dựng content funnel
tăng chuyển đổi bán hàng
phù hợp SEO Google 2025
Yêu cầu phân tích:
1️⃣ KEY PHỤ (10–20 keyword)
keyword mở rộng của sản phẩm
keyword commercial investigation
keyword buyer intent
keyword giá, loại, so sánh, vật liệu, thông số
keyword vấn đề khách hàng gặp
keyword có khả năng chuyển đổi cao
long-tail keyword
2️⃣ KEY BLOG (15–30 topic blog)
keyword informational
câu hỏi người dùng tìm kiếm
pain point khách hàng
lỗi thường gặp
cách dùng / hướng dẫn / so sánh
tiêu chuẩn / quy định / kiến thức
search intent rõ ràng
dễ SEO lên top
3️⃣ Phân loại search intent cho từng keyword:
Informational
Commercial
Transactional
4️⃣ Output dạng HTML:
Hãy xuất ra 2 bảng HTML riêng biệt, không có cột ghi chú hay mục tiêu, chỉ có STT, Keyword và Search Intent.
Bảng 1: Danh sách KEY PHỤ (Tập trung vào Commercial/Transactional intent).
Bảng 2: Danh sách KEY BLOG (Tập trung vào Informational intent để viết nội dung).
Không giải thích dài dòng.
Không viết nội dung bài viết.
Chỉ trả kết quả là 2 bảng HTML.
Input của tôi:
KEY CHÍNH: ${keyChinh}
  `;

  const result = await ai.models.generateContent({
    model: model,
    contents: [{ parts: [{ text: prompt }] }],
  });

  return result.text;
};
