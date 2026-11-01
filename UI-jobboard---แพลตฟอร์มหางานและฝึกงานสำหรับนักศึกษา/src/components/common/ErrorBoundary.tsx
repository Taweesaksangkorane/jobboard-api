import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackBackPath?: string;
  fallbackBackLabel?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught rendering error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      const backPath = this.props.fallbackBackPath || '/';
      const backLabel = this.props.fallbackBackLabel || 'กลับสู่หน้าหลัก (Back)';

      return (
        <div className="flex min-h-[60vh] items-center justify-center p-6">
          <div className="w-full max-w-lg rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-[#E05252]">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h2 className="text-lg font-bold text-[#25243A] mb-2">
              เกิดข้อผิดพลาดในการแสดงผลหน้าเว็บ
            </h2>
            <p className="text-xs text-[#73758A] leading-relaxed mb-4">
              ระบบตรวจพบข้อผิดพลาดที่ไม่คาดคิดขณะแสดงผลหน้านี้ คุณสามารถลองโหลดส่วนนี้ใหม่อีกครั้งหรือย้อนกลับไปยังหน้าก่อนหน้า
            </p>
            {this.state.error?.message && (
              <div className="mb-6 rounded-xl border border-[#E9EAF1] bg-[#F8F9FC] px-4 py-2.5 text-left text-[11px] font-mono text-[#73758A] break-words">
                {this.state.error.message}
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#6C4CE3] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#5638C5] transition cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                ลองใหม่อีกครั้ง (Retry)
              </button>
              <a
                href={backPath}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-[#E9EAF1] bg-white px-5 py-2.5 text-xs font-semibold text-[#25243A] hover:bg-gray-50 transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {backLabel}
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
