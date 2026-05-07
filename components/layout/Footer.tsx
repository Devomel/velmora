export default function Footer({ rights }: { rights: string }) {
  return (
    <footer className="border-t border-gray-200 mt-auto py-6 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} Tableware. {rights}
    </footer>
  );
}
