import { redirect } from 'next/navigation';

const DEMO_DRIVE_URL = 'https://drive.google.com/file/d/placeholder-id/view?usp=sharing';

export default function DemoPage() {
  redirect(DEMO_DRIVE_URL);
}
