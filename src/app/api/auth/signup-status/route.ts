import { NextResponse } from 'next/server';
import { isSignupEnabled } from '@/lib/security';

export async function GET() {
  try {
    const signupEnabled = isSignupEnabled();
    
    return NextResponse.json({
      enabled: signupEnabled
    });
  } catch (error) {
    console.error('Error checking signup status:', error);
    return NextResponse.json(
      { enabled: false },
      { status: 500 }
    );
  }
}
