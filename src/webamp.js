import { useEffect, useState, useRef } from '@wordpress/element';
import Webamp from 'webamp';

export const WebAmp = ( props ) => {
	const { audio = [], currentSkin = '' } = props;
	const divRef = useRef( null );
	const [ webamp, setWebamp ] = useState( null );

	// Initial player load
	useEffect( () => {
		if ( divRef === null ) {
			return;
		}

		const options = {
			initialTracks: [],
		};

		audio.forEach( ( audioTrack ) =>
			options.initialTracks.push( { url: audioTrack.url } )
		);

		// Add the custom skin if it was set
		if ( currentSkin ) {
			const match = currentSkin.match(
				/(?:https?:)?(?:\/\/)?skins\.webamp\.org\/skin\/(\w+)\/(?:.*)?/
			);
			if ( match && match.length === 2 ) {
				options.initialSkin = {
					url: `https://cdn.webampskins.org/skins/${ match[ 1 ] }.wsz`,
				};
			}
		}

		const player = new Webamp( options );
		setWebamp( player );
		player.renderWhenReady( divRef.current );

		return () => {
			player.dispose();
		};
	}, [ divRef.current ] );

	// Change the skin as it changes
	useEffect( () => {
		if ( webamp === null ) {
			return;
		}

		if ( currentSkin ) {
			const match = currentSkin.match(
				/(?:https?:)?(?:\/\/)?skins\.webamp\.org\/skin\/(\w+)\/(?:.*)?/
			);
			if ( match && match.length === 2 ) {
				webamp.setSkinFromUrl(
					`https://cdn.webampskins.org/skins/${ match[ 1 ] }.wsz`
				);
			}
		} else {
			webamp.setSkinFromUrl(
				'https://cdn.webampskins.org/skins/5e4f10275dcb1fb211d4a8b4f1bda236.wsz'
			);
		}
	}, [ currentSkin ] );

	return <div ref={ divRef } />;
};

export default WebAmp;
