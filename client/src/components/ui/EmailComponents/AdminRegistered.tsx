import {Heading, Hr, Html, Img, Markdown, Section} from '@react-email/components';

type Props = {
	newAdminName: string;
	authorName: string;
	createdAt: string;
};

export const AdminRegistered: React.FC<Props> = ({
	newAdminName = 'name',
	authorName = 'author',
	createdAt = 'now'
}) => {
	return (
		<Html>
			<Section
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					padding: '1em',
					fontFamily: 'Helvetica, Sans-Serif'
				}}
				width={'100%'}
			>
				<Img
					src='https://drive.google.com/file/d/1TNJ2NT61Fe4TQ-drJN2HTWZS0mUJN6qa/view'
					alt='labret-logo'
					width={100}
				/>
				<Markdown
					markdownCustomStyles={{
						h2: {
							fontWeight: 'bold'
						},
						bold: {
							color: 'green'
						}
					}}
				>
					{'## A new admin have been **registered**!'}
				</Markdown>
				<Markdown>{`**${newAdminName}** was registered successfully as a new admin by **${authorName}** at **${createdAt}**`}</Markdown>
				<Section style={{marginTop: '3em'}}>
					<Hr />
					<Heading as={'h4'}>Exclusively by Labret</Heading>
				</Section>
			</Section>
		</Html>
	);
};
