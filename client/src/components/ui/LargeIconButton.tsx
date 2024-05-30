import {As, Container, Flex, Icon, Text} from '@chakra-ui/react';
import {SyntheticEvent} from 'react';

type Props = {
	label: string;
	icon: As;
	iconW: number;
	iconH: number;
	onClick: (e?: SyntheticEvent) => void;
	variant?: string;
};

export const LargeIconButton: React.FC<Props> = ({variant, icon, iconW, iconH, label, onClick}) => {
	const styles =
		variant == 'outline'
			? {
					color: 'lrBrown.700',
					border: '2px solid',
					borderColor: 'lrBrown.700',
					_hover: {backgroundColor: 'lrBrown.400'},
					_active: {backgroundColor: 'lrBrown.300'}
			  }
			: {
					backgroundColor: 'lrBrown.700',
					color: 'whiteDarkMode',
					_hover: {borderColor: 'lrBrown.600', backgroundColor: 'lrBrown.600'},
					_active: {backgroundColor: 'lrBrown.400'}
			  };

	return (
		<Container
			onClick={onClick}
			p={5}
			m={0}
			borderRadius={5}
			maxW={'12rem'}
			cursor={'pointer'}
			{...styles}
			transition={'.15s ease-out '}
		>
			<Flex alignItems={'center'} flexDirection={'column'}>
				<Icon as={icon} w={iconW} h={iconH} />
				<Text fontWeight={700}>{label}</Text>
			</Flex>
		</Container>
	);
};
