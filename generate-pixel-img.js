// Vercel Serverless Function으로 동작하는 코드
export default async function handler(req, res) {
  // POST 메서드만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST 요청만 처리합니다.' });
  }

  // Vercel 프로젝트의 환경 변수에서 API 키를 안전하게 로드
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: '서버에 API 키가 설정되지 않았습니다.' });
  }

  try {
    // 실제 Google AI API 엔드포인트 주소
    const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`;
    
    // 아임웹에서 받은 요청 데이터를 그대로 Google AI 서버로 전달
    const apiResponse = await fetch(googleApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    // Google AI 서버로부터 받은 응답이 정상이 아닐 경우, 에러를 그대로 전달
    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      console.error('Google API Error:', errorData);
      return res.status(apiResponse.status).json(errorData);
    }

    // 성공적인 응답 데이터를 다시 아임웹 사이트로 전달
    const data = await apiResponse.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).json({ error: '서버 내부 처리 중 오류가 발생했습니다.' });
  }
}