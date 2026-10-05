import React from 'react';
import {
  Globe,
  Compass,
  Code2,
  Play,
  Archive,
  FileText,
  Palette,
  Video,
  Terminal,
  ShieldCheck,
  GraduationCap,
  MessageSquare,
  Wrench,
  Layers,
} from 'lucide-react';

interface AppIconProps {
  iconType: string;
  accentColor: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AppIcon: React.FC<AppIconProps> = ({ iconType, accentColor, size = 'md' }) => {
  const dimensions = {
    sm: 'w-10 h-10 rounded-lg',
    md: 'w-12 h-12 rounded-xl',
    lg: 'w-16 h-16 rounded-2xl',
  }[size];

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }[size];

  const renderGlyph = () => {
    switch (iconType) {
      case 'chrome':
        return <Globe className={iconSizes} style={{ color: accentColor }} />;
      case 'firefox':
        return <Compass className={iconSizes} style={{ color: accentColor }} />;
      case 'edge':
        return <Globe className={iconSizes} style={{ color: accentColor }} />;
      case 'vscode':
        return <Code2 className={iconSizes} style={{ color: accentColor }} />;
      case 'vlc':
        return <Play className={iconSizes} style={{ color: accentColor }} />;
      case '7zip':
        return <Archive className={iconSizes} style={{ color: accentColor }} />;
      case 'libreoffice':
        return <FileText className={iconSizes} style={{ color: accentColor }} />;
      case 'gimp':
        return <Palette className={iconSizes} style={{ color: accentColor }} />;
      case 'obs':
        return <Video className={iconSizes} style={{ color: accentColor }} />;
      case 'python':
        return <Terminal className={iconSizes} style={{ color: accentColor }} />;
      case 'security':
        return <ShieldCheck className={iconSizes} style={{ color: accentColor }} />;
      case 'education':
        return <GraduationCap className={iconSizes} style={{ color: accentColor }} />;
      case 'communication':
        return <MessageSquare className={iconSizes} style={{ color: accentColor }} />;
      case 'utilities':
        return <Wrench className={iconSizes} style={{ color: accentColor }} />;
      case 'design':
        return <Layers className={iconSizes} style={{ color: accentColor }} />;
      default:
        return <Code2 className={iconSizes} style={{ color: accentColor }} />;
    }
  };

  return (
    <div
      className={`${dimensions} flex items-center justify-center shrink-0 border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/70`}
      aria-hidden="true"
    >
      {renderGlyph()}
    </div>
  );
};
