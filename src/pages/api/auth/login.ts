import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../utils/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Преобразуем username в формат email
    const pseudoEmail = `${username}@mail.ru`;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: pseudoEmail, // Используем псевдо-email
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Получаем профиль пользователя из другой таблицы, если нужно
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) {
      console.error('Error fetching user profile:', userError);
    }

    return res.status(200).json({
      post: {
        id: data.user.id,
        username: username, // Используем оригинальный username
        role: userData?.role || 'user',
        access_token: data.session.access_token,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'An error occurred during login' });
  }
}