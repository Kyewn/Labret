import {inputAnatomy, listAnatomy, menuAnatomy, stepperAnatomy} from '@chakra-ui/anatomy';
import {
	createMultiStyleConfigHelpers,
	defineStyleConfig,
	extendTheme,
	theme
} from '@chakra-ui/react';

const Button = defineStyleConfig({
	baseStyle: {
		minHeight: '3rem',
		fontFamily: `'Roboto', sans-serif`
	},
	variants: {
		solid: {
			backgroundColor: 'lrBrown.700',
			color: 'contrastWhite',
			minWidth: '100px',
			_hover: {
				borderColor: 'lrBrown.600',
				backgroundColor: 'lrBrown.600',
				_disabled: {
					opacity: 0.3,
					backgroundColor: 'lrBrown.600'
				}
			},
			_active: {
				backgroundColor: 'lrBrown.400'
			},
			_focus: {
				outline: 'none'
			}
		},
		secondary: {
			backgroundColor: 'none',
			color: 'lrBrown.600',
			border: '2px solid',
			borderColor: 'lrBrown.600',
			_hover: {
				color: 'lrBrown.600',
				borderColor: 'lrBrown.200',
				backgroundColor: 'lrBrown.200'
			},
			_active: {
				borderColor: 'lrBrown.100',
				backgroundColor: 'lrBrown.100'
			},
			_focus: {
				outline: 'none'
			}
		},
		outline: {
			border: '2px solid',
			borderColor: 'lrBrown.700',
			color: 'lrBrown.700',
			_hover: {
				backgroundColor: 'lrBrown.400'
			},
			_active: {
				backgroundColor: 'lrBrown.700',
				color: 'contrastWhite',
				borderColor: 'lrBrown.700'
			}
		},
		criticalOutline: {
			border: '2px solid',
			borderColor: 'lrRed.300',
			color: 'lrRed.300',
			_hover: {
				backgroundColor: 'lrRed.300',
				color: 'contrastWhite'
			},
			_active: {
				backgroundColor: 'lrRed.100',
				borderColor: 'lrRed.100'
			}
		},
		iconButton: {
			minWidth: '50px',
			_hover: {
				backgroundColor: 'grey.100',
				svg: {
					stroke: 'black'
				}
			}
		},
		itemIconButton: {
			position: 'absolute',
			top: -3,
			right: -3,
			backgroundColor: 'white',
			boxShadow: '0 0 2px 0 black',
			padding: 1,
			minWidth: '2em',
			minHeight: '2em',
			height: '2em',
			svg: {
				width: '1em'
			},
			_hover: {
				backgroundColor: 'grey.100',
				svg: {
					stroke: 'black'
				}
			}
		},
		criticalItemIconButton: {
			position: 'absolute',
			top: -3,
			right: -3,
			backgroundColor: 'white',
			boxShadow: '0 0 2px 0 black',
			padding: 1,
			minWidth: '2em',
			minHeight: '2em',
			height: '2em',
			svg: {
				stroke: 'lrRed.300',
				width: '1em'
			},
			_hover: {
				backgroundColor: 'grey.100',
				svg: {
					stroke: 'black'
				}
			}
		},
		tableHeader: {
			maxWidth: '200px',
			background: 'none',
			fontSize: 'sm',
			fontFamily: theme.fonts.heading,
			textTransform: 'uppercase',
			span: {
				overflow: 'hidden',
				textOverflow: 'ellipsis'
			},
			_hover: {
				borderColor: 'lrBrown.300',
				backgroundColor: 'lrBrown.300',
				_disabled: {
					opacity: 0.4,
					backgroundColor: 'lrBrown.600'
				}
			},
			_focus: {
				outline: 'none'
			},
			_disabled: {
				opacity: 0.4,
				backgroundColor: 'lrBrown.600'
			}
		}
	}
});

const Input = createMultiStyleConfigHelpers(inputAnatomy.keys).defineMultiStyleConfig({
	variants: {
		filled: {
			field: {
				border: '2px solid',
				borderColor: 'lrBrown.700',
				backgroundColor: 'unset',
				_hover: {
					backgroundColor: 'grey.100'
				},
				_focus: {
					border: '2px solid',
					borderColor: 'lrBrown.600'
				}
			}
		}
	},
	defaultProps: {
		variant: 'filled'
	}
});

const List = createMultiStyleConfigHelpers(listAnatomy.keys).defineMultiStyleConfig({
	baseStyle: {
		item: {
			paddingX: 10,
			paddingY: 5,
			cursor: 'pointer',
			_hover: {
				backgroundColor: 'lrBrown.700',
				color: 'contrastWhite'
			},
			_active: {
				backgroundColor: 'lrBrown.400'
			},
			_focus: {
				outline: 'none'
			}
		}
	}
});

const Menu = createMultiStyleConfigHelpers(menuAnatomy.keys).defineMultiStyleConfig({
	baseStyle: {
		list: {
			maxHeight: '50vh',
			overflowY: 'auto'
		}
	}
});

const Stepper = createMultiStyleConfigHelpers(stepperAnatomy.keys).defineMultiStyleConfig({
	baseStyle: {
		indicator: {
			'&[data-status=active]': {
				borderColor: 'lrBrown.700'
			},
			'&[data-status=incomplete]': {
				borderColor: 'lrBrown.400'
			},
			'&[data-status=complete]': {
				backgroundColor: 'lrBrown.700'
			}
		},
		number: {
			'&[data-status=active]': {
				color: 'lrBrown.700'
			},
			'&[data-status=incomplete]': {
				color: 'lrBrown.400'
			}
		},
		separator: {
			'&[data-status=complete]': {
				backgroundColor: 'lrBrown.700'
			}
		}
	}
});

// Ascending value = lighter -> darker
// Semantic tokens switch between color modes, default light mode
export const themes = extendTheme({
	semanticTokens: {
		colors: {
			lrBrown: {
				100: {
					default: '#F7F0F5',
					_dark: '#F7F0F5'
				},
				200: {
					default: '#E5D1D0',
					_dark: '#E5D1D0'
				},
				300: {
					default: '#F5E4D7',
					_dark: '#F5E4D7'
				},
				400: {
					default: '#DECBB7',
					_dark: '#5C5552'
				},
				500: {
					default: '#8F857D',
					_dark: '#E5D1D0'
				},
				600: {
					default: '#5C5552',
					_dark: '#F5E4D7'
				},
				700: {
					default: '#433633',
					_dark: '#DECBB7'
				}
			},
			lrRed: {
				100: '#FF7676',
				200: '#FF5757',
				300: '#FF4040'
			},
			contrastWhite: {
				default: '#FFFFFF',
				_dark: '#000000'
			},
			grey: {
				100: {
					default: '#EEEEEE',
					_dark: '#D4D0C8'
				},
				200: {
					default: '#D9D9D9',
					_dark: '#D9D9D9'
				},
				300: {
					default: '#D4D0C8',
					_dark: '#EEEEEE'
				}
			}
		}
	},
	fonts: {
		heading: `'Fredoka One', sans-seif`,
		body: `'Roboto', sans-serif`
	},
	components: {
		Button,
		Input,
		Menu,
		List,
		Stepper
		// Table,
	}
});
