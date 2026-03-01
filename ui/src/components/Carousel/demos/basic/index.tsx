import { Block, Carousel, Text } from '@platform-blocks/ui';

export default function Demo() {
	return (
		<Block gap="md" fullWidth>
			<Carousel
				height={220}
				loop
				autoPlay
				autoPlayInterval={4500}
				showDots
				style={{ width: '100%' }}
			>
				<Block
					gap="sm"
					bg="#4C1D95"
					radius="xl"
					p="xl"
					justify="center"
					minH={220}
				>
					<Text variant="h3" color="white">
						Weekly highlights
					</Text>
					<Text color="rgba(255,255,255,0.85)">
						Rotate through featured stories without building pagination controls.
					</Text>
				</Block>

				<Block
					gap="sm"
					bg="#155E75"
					radius="xl"
					p="xl"
					justify="center"
					minH={220}
				>
					<Text variant="h3" color="white">
						Product updates
					</Text>
					<Text color="rgba(255,255,255,0.85)">
						Enable `autoPlay` and `loop` to keep the carousel moving hands-free.
					</Text>
				</Block>

				<Block
					gap="sm"
					bg="#166534"
					radius="xl"
					p="xl"
					justify="center"
					minH={220}
				>
					<Text variant="h3" color="white">
						Team spotlights
					</Text>
					<Text color="rgba(255,255,255,0.85)">
						Add a few slides to share wins, announcements, or campaign promos.
					</Text>
				</Block>
			</Carousel>
		</Block>
	);
}
