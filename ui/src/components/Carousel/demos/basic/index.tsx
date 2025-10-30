import React, { memo } from 'react';
import { Carousel, H2, Text, Block } from '@platform-blocks/ui';

const SLIDES = [
	{ id: 1, color: '#FF6B6B', title: 'Slide 1', content: 'First slide content' },
	{ id: 2, color: '#4ECDC4', title: 'Slide 2', content: 'Second slide content' },
	{ id: 3, color: '#45B7D1', title: 'Slide 3', content: 'Third slide content' },
	{ id: 4, color: '#96CEB4', title: 'Slide 4', content: 'Fourth slide content' },
];

const CarouselSlide = memo(({ slide }: { slide: typeof SLIDES[0] }) => (
	<Block
		direction="column"
		grow
		bg={slide.color}
		radius="xl"
		justify="center"
		align="center"
		gap="sm"
		p="xl"
	>
		<H2>{slide.title}</H2>
		<Text>{slide.content}</Text>
	</Block>
));

export default function BasicCarouselDemo() {
	return (
		<Block w={300}>
			<Carousel autoPlay loop>
				{SLIDES.map((slide) => (
					<CarouselSlide key={slide.id} slide={slide} />
				))}
			</Carousel>
		</Block>
	);
}
 