import { getMessages } from '@/lib/i18n';
import MonoPage from '@/components/mono/MonoPage';

export default async function Mono1Page() {
  const { mono1 } = await getMessages();
  return <MonoPage t={mono1} newPrice={14} oldPrice={29} image="/mono-products/1.jpg" />;
}
