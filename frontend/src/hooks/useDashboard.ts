import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Screen } from '@/types/chat';

export function useDashboard() {
  const [screen, setScreenState] = useState<Screen>('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [activeQuery, setActiveQuery] = useState('Why did Q3 profit decline?');
  const router = useRouter();

  const toggleSidebar = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  const handleQuery = useCallback((q: string) => {
    setActiveQuery(q);
    setScreenState('chat');
    // Also push routing if we want URL-based state, but since we have AppRouter pages, we can navigate:
    router.push(`/dashboard/chat?q=${encodeURIComponent(q)}`);
  }, [router]);

  const setScreen = useCallback((newScreen: Screen) => {
    setScreenState(newScreen);
    if (newScreen === 'dashboard') {
      router.push('/dashboard');
    } else {
      router.push(`/dashboard/${newScreen}`);
    }
  }, [router]);

  return {
    screen,
    setScreen,
    collapsed,
    toggleSidebar,
    activeQuery,
    handleQuery,
  };
}
