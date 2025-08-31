export default async function handler(req, res) {
  // ⬇️ *** CORS 허용 설정 시작 *** ⬇️
  // 특정 출처(당신의 아임웹 사이트)를 허용합니다.
  res.setHeader('Access-Control-Allow-Origin', 'https://adcusgemini202597401.imweb.me');
  // 서버가 허용할 요청 방식(메서드)을 지정합니다.
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  // 서버가 허용할 요청 헤더를 지정합니다.
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 브라우저가 본 요청을 보내기 전에 보내는 'preflight' 요청(OPTIONS)에 대한 처리입니다.
  // 이 부분은 CORS 정책 확인을 위해 반드시 필요합니다.
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  // ⬆️ *** CORS 허용 설정 끝 *** ⬆️

  // POST 메서드가 아닐 경우의 기존 로직은 그대로 유지합니다.
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST 요청만 처리합니다.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: '서버에 API 키가 설정되지 않았습니다.' });
  }

  try {
    const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`;
    
    const apiResponse = await fetch(googleApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      console.error('Google API Error:', errorData);
      return res.status(apiResponse.status).json(errorData);
    }

    const data = await apiResponse.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).json({ error: '서버 내부 처리 중 오류가 발생했습니다.' });
  }
}