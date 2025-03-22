This is a React Native cross-platform Web Application for Mafia game hosts. Supports only Russian language.



## Описание проекта
Этот проект представляет собой фронтенд-приложение помощника ведущего в смортивную Мафию, созданное с использованием **Next.js**, **React 19**, **TailwindCSS**, и других полезных библиотек. Деплой осуществляется на **Vercel**.
Приложение производит запись ролей, все ночные и дневные действия игроков и окончание игры

##  Установка и запуск

### 1. Клонирование репозитория
```sh
git clone <URL_РЕПОЗИТОРИЯ>
cd frontend
```

### 2. Установка зависимостей
```sh
npm install
```

### 3. Запуск в режиме разработки
```sh
npm run dev
```
Приложение будет доступно по адресу `http://localhost:3000`.

### 4. Сборка и запуск продакшн-сервера
```sh
npm run build
npm run start
```

## 🛠 Используемые технологии
- **Next.js** (версия 15.0.3)
- **React 19**
- **TailwindCSS** (для стилизации)
- **Radix UI** (компоненты UI)
- **Supabase** (бэкенд-as-a-service)
- **Jest** (тестирование)
- **Axios** (работа с API)

## Запуск тестов
```sh
npm run test
```
Для просмотра тестов в реальном времени:
```sh
npm run test:watch
```

## Деплой на Vercel
Vercel поддерживает автоматический деплой Next.js-приложений.

### 1. Установка Vercel CLI (если ещё не установлен)
```sh
npm install -g vercel
```

### 2. Авторизация в Vercel
```sh
vercel login
```

### 3. Деплой проекта
```sh
vercel
```
После выполнения команда выдаст URL, по которому доступен ваш проект.

### 4. Настройка окружения
Для работы Supabase или других API добавьте переменные окружения в Vercel:
```sh
vercel env add <KEY>
```
Или создайте `.env.local` в корне проекта:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

##  Полезные команды
- `npm run lint` — запуск линтера
- `npm run build` — сборка проекта
- `npm run start` — запуск продакшн-сервера
- `vercel env pull` — загрузка переменных окружения из Vercel


