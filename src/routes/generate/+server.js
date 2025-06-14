// src/routes/generate/+server.js
import { redirect } from '@sveltejs/kit';

export async function POST({ request }) {
  const formData = await request.formData();

  const params = new URLSearchParams();
  for (const [key, value] of formData.entries()) {
    params.append(key, value.toString());
  }
  // console.log('Form Data:', Object.fromEntries(formData.entries()));

  let redirect_link = `/result?${params.toString()}`
  console.log('redirect_link:', redirect_link);

  throw redirect(303, redirect_link);
}