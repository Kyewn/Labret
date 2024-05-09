import '@/App.css';
import {LabretIcon} from '@/assets/LabretIcon';
import {useAppContext} from '@/utils/context/AppContext';
import {Flex, HStack, IconButton, Spacer, Tooltip, useColorMode} from '@chakra-ui/react';
import {ArrowLeft, Moon, Sun} from 'lucide-react';
import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

const SubHeader: React.FC = () => {
	const {appState, appDispatch} = useAppContext();
	const {colorMode, toggleColorMode} = useColorMode();
	const {handleSubHeaderBack} = appState;
	const navigate = useNavigate();

	useEffect(() => {
		appDispatch({
			type: 'SET_HANDLE_SUBHEADER_BACK',
			payload: () => {
				navigate(-1);
			}
		});
	}, []);

	return (
		<>
			<Flex
				paddingX={5}
				paddingY={2}
				boxShadow={
					colorMode == 'dark'
						? '0 0 8px 0 var(--chakra-colors-gray-300)'
						: '0 0 8px 0 var(--chakra-colors-gray-500)'
				}
			>
				<HStack>
					<Tooltip label={'Back'} hasArrow>
						<IconButton
							aria-label={'Back'}
							variant={'iconButton'}
							isRound
							icon={<ArrowLeft />}
							onClick={handleSubHeaderBack}
						/>
					</Tooltip>
					<LabretIcon w={100} h={'unset'} fill={colorMode == 'dark' ? 'white' : 'black'} />
				</HStack>
				<Spacer />
				<Tooltip label={colorMode == 'dark' ? 'Toggle Light Mode' : 'Toggle Night Mode'} hasArrow>
					<IconButton
						aria-label={'Night Mode'}
						variant={'iconButton'}
						isRound
						icon={colorMode == 'dark' ? <Sun /> : <Moon />}
						onClick={toggleColorMode}
					/>
				</Tooltip>
			</Flex>
		</>
	);
};

export default SubHeader;
