import * as LucideIcons from 'lucide-react-native';
import { iconWithClassName } from './iconWithClassName';

for (const icon of Object.values(LucideIcons)) {
  if (typeof icon === 'function' && 'displayName' in icon) {
    iconWithClassName(icon);
  }
}

export * from 'lucide-react-native';

