import { useWindowDimensions, StyleSheet, Image, Platform } from 'react-native';

// import { Collapsible } from '@/components/Collapsible';
// import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedInput } from '@/components/ThemedInput';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTwoScreen() {
  const { width } = useWindowDimensions();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080" 
          name="person.crop.circle.badge.xmark"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Gather your gang</ThemedText>
      </ThemedView>
      <ThemedText>Dieser User ist deine Maus (Stern Platzhalter)</ThemedText>
      <ThemedInput
          placeholder="Gib den Namen deiner Maus ein"
          type="rounded"
      />

      <ThemedText>Dein Name (Stern Platzhalter)</ThemedText>
      <ThemedInput
          placeholder="Gib deinen Namen ein"
          type="rounded"
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
