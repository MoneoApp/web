import { useEffect, useState } from 'react';

export function useFileUrl(file?: File) {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    if (!file) {
      return;
    }

    let current = true;
    const reader = new FileReader();

    reader.onload = () => current && setUrl(reader.result as string);

    reader.readAsDataURL(file);

    return () => {
      current = false;
    };
  }, [file, setUrl]);

  return url;
}
