import { ImageResponse } from 'next/og';
import { profile } from '@/data/profile';
import { getInitials } from '@/lib/utils';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#2563eb',
        color: '#ffffff',
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: -0.5,
        borderRadius: 8,
      }}
    >
      {getInitials(profile.name)}
    </div>,
    { ...size },
  );
}
