import { useDialoog } from 'dialoog';
import { useCallback } from 'react';

import { Error } from '../../shared/constants';
import { Notification } from '../components/Notification';
import { messages } from '../constants';

export function useNotify() {
  const [, { open }] = useDialoog();

  return useCallback((message: string, timeout = 2500) => void open((props) => (
    <Notification message={messages[message as Error] ?? message} timeout={timeout} {...props}/>
  ), { stack: 'notifications', capture: false }), []);
}
