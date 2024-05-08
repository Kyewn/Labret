import {inputAnatomy, listAnatomy, menuAnatomy} from '@chakra-ui/anatomy';
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
					opacity: 0.4
					// backgroundColor: 'lrBrown.600'
				}
			},
			_active: {
				backgroundColor: 'lrBrown.400'
			},
			_focus: {
				outline: 'none'
			}
			// _disabled: {
			// 	opacity: 0.4,
			// 	backgroundColor: 'lrBrown.600'
			// }
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
				backgroundColor: 'lrBrown.700',
				color: 'contrastWhite'
			},
			_active: {
				backgroundColor: 'lrBrown.400',
				borderColor: 'lrBrown.400'
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
				borderColor: 'asGrey.100',
				backgroundColor: 'white',
				_hover: {
					backgroundColor: 'asGrey.200'
				},
				_focus: {
					border: '2px solid',
					borderColor: 'lrBrown.600',
					backgroundColor: 'white'
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
					_dark: '#D9D9D9'
				},
				200: {
					default: '#D9D9D9',
					_dark: '#EEEEEE'
				},
				300: {
					default: '#D4D0C8',
					_dark: '#D9D9D9'
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
		List
		// Table,
	}
});
