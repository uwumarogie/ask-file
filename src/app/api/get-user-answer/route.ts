import { answerUserQuestion } from "@/util/openai-service/answer-user-question-service";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  input: z.string(),
  pineconeResult: z.object({
    namespace: z.string(),
    matches: z.array(
      z.object({
        id: z.string(),
        metadata: z.object({
          file_id: z.string(),
          text: z.string(),
        }),
        values: z.array(z.number()),
      }),
    ),
    usage: z.object({
      readUnits: z.number(),
    }),
  }),
});

export async function POST(request: NextRequest) {
  const _context = await request.json();
  const { input, pineconeResult } = requestSchema.parse(_context);
  try {
    const response = await answerUserQuestion(input, pineconeResult);
    if (response.success) {
      return NextResponse.json({
        success: true,
        responseText: response.responseText,
      });
    } else {
      return NextResponse.json({
        success: false,
        responseText: response.responseText,
      });
    }
  } catch (error) {
    console.error("Error in the route get-user-answer", error);
    return NextResponse.json({
      success: false,
      responseText: "Something went wrong",
    });
  }
}
