import { TextInput, type TextInputProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'rounded' | 'underlined';
};

export function ThemedInput({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'border');

  return (
    <TextInput
      style={[
        { color, borderColor },
        type === 'default' ? styles.default : undefined,
        type === 'rounded' ? styles.rounded : undefined,
        type === 'underlined' ? styles.underlined : undefined,
        style,
      ]}
      placeholderTextColor={color}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderRadius: 4,
  },
  rounded: {
    fontSize: 16,
    padding: 12,
    borderWidth: 1,
    borderRadius: 20,
  },
  underlined: {
    fontSize: 16,
    padding: 10,
    borderBottomWidth: 2,
    borderRadius: 0,
  },
});
