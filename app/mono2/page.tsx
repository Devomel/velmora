import { getMessages } from '@/lib/i18n';
import MonoPage from '@/components/mono/MonoPage';

export default async function Mono2Page() {
  const { mono2 } = await getMessages();
  return <MonoPage t={mono2} newPrice={37} oldPrice={68} image="/mono-products/2.jpg" />;
}
