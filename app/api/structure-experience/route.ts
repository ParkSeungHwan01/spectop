import { NextResponse } from 'next/server';

// 자유 서술에서 역할·기술·성과를 추출한다.
// 원칙: 서술에 없는 내용은 추정하지 않고 빈 값으로 둔다. 추출 결과는 화면에서 사용자가 확인/수정 후에만 저장된다.

const TIMEOUT_MS = 15000;

interface StructuredResult {
  role: string;
  skills: string[];
  outcome: string;
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: 'OPENAI_API_KEY가 서버에 설정되어 있지 않습니다.' },
      { status: 500 }
    );
  }

  let description: string;
  try {
    const body = await req.json();
    description = typeof body?.description === 'string' ? body.description.trim() : '';
  } catch {
    return NextResponse.json({ ok: false, error: '요청 형식이 올바르지 않습니다.' }, { status: 400 });
  }

  if (!description) {
    return NextResponse.json({ ok: false, error: '분석할 설명이 없습니다.' }, { status: 400 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-6-luna',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              '너는 대학생의 프로젝트/경험 서술을 구조화하는 도우미다. 사용자가 적은 문장에 실제로 쓰인 내용만 근거로 JSON을 만들어라. ' +
              '문장에 없는 정보는 추측하지 말고 빈 문자열 또는 빈 배열로 남겨라. ' +
              '출력은 반드시 {"role": string, "skills": string[], "outcome": string} 형식의 JSON 객체 하나여야 한다.',
          },
          { role: 'user', content: description },
        ],
      }),
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.error('OpenAI API error', response.status, errText, {
        organization: response.headers.get('openai-organization'),
        processingMs: response.headers.get('openai-processing-ms'),
        requestId: response.headers.get('x-request-id'),
      });
      return NextResponse.json(
        { ok: false, error: 'AI 분석 서버 응답에 실패했습니다. 잠시 후 다시 시도해주세요.' },
        { status: 502 }
      );
    }

    const json = await response.json();
    const content = json?.choices?.[0]?.message?.content;
    if (typeof content !== 'string') {
      return NextResponse.json(
        { ok: false, error: 'AI 응답을 해석할 수 없습니다. 잠시 후 다시 시도해주세요.' },
        { status: 502 }
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { ok: false, error: 'AI 응답 형식이 올바르지 않습니다. 잠시 후 다시 시도해주세요.' },
        { status: 502 }
      );
    }

    const p = (parsed ?? {}) as Record<string, unknown>;
    const result: StructuredResult = {
      role: typeof p.role === 'string' ? p.role.trim() : '',
      skills: Array.isArray(p.skills) ? p.skills.filter((s): s is string => typeof s === 'string' && s.trim() !== '') : [],
      outcome: typeof p.outcome === 'string' ? p.outcome.trim() : '',
    };

    return NextResponse.json({ ok: true, data: result });
  } catch (err) {
    clearTimeout(timeout);
    const aborted = err instanceof Error && err.name === 'AbortError';
    console.error('structure-experience failed', err);
    return NextResponse.json(
      {
        ok: false,
        error: aborted
          ? 'AI 분석이 시간 내에 끝나지 않았습니다. 잠시 후 다시 시도해주세요.'
          : '잠시 후 다시 시도해주세요.',
      },
      { status: 502 }
    );
  }
}
