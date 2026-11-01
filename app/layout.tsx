import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bé Vui Học An Toàn Giao Thông 3D',
  description: 'Trò chơi 3D hoạt hình tương tác vui nhộn ôn tập kiến thức An toàn Giao thông dành cho học sinh tiểu học với 19 câu hỏi trắc nghiệm, biển báo và tình huống thực tế.',
  openGraph: {
    title: 'Bé Vui Học An Toàn Giao Thông 3D',
    description: 'Trò chơi 3D hoạt hình tương tác vui nhộn ôn tập kiến thức An toàn Giao thông dành cho học sinh tiểu học.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bé Vui Học An Toàn Giao Thông 3D',
    description: 'Trò chơi 3D hoạt hình tương tác vui nhộn ôn tập kiến thức An toàn Giao thông dành cho học sinh tiểu học.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="vi" className="h-full">
      <body suppressHydrationWarning className="h-full w-full overflow-hidden select-none bg-sky-100 text-slate-800 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
