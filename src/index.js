#!/usr/bin/env node
const { Command, CommanderError } = require( "commander" )
const ffmpeg = require( "fluent-ffmpeg" )
const cliProgress = require( "cli-progress" )

const Errorer = ( err ) => {
	program.error( err )
}

const round = ( number ) => Math.trunc( number * 1000 ) / 1000

const ffmpegPromise = (
	command,
	saveToName,
	progressBar,
	onProgressCallback,
	onEndCallback,
) =>
	new Promise( ( resolve, reject ) => {
		command.clone()
			.on( "progress", ( data ) => {
				onProgressCallback( progressBar, data )
			} )
			.on( "end", () => {
				onEndCallback( progressBar )
				resolve()
			} )
			.on( "error", ( err, stdout, stderr ) => {
				return reject(
					Errorer(
						`Something went wrong with ffmpeg\n${err} \n ${stdout} \n ${stderr}`,
					),
				)
			} )
			.save( saveToName )
	} )

const parseTimeToSeconds = ( timeString ) => {
	const sections = timeString.split( ":" )
	let scaleFactor = 1, seconds = 0

	sections.reverse().forEach( ( timeConstituent ) => {
		// parse the time part to an integer, and multiply by the scaleFactor (thus why it starts one, because seconds map 1 to 1)
		seconds += scaleFactor * parseInt( timeConstituent, 10 )

		// now we will be moving up the parts, so each time we increase by 60 timeConstituent
		scaleFactor *= 60
	} )

	return seconds
}

const fs = require( "fs" )
const nodePath = require( "path" )
const readFile = ( path ) =>
	fs.readFileSync( path ).toString().split( "\n" ).filter( ( str ) => str !== "" )

const validatePath = ( path ) => {
	const exists = fs.existsSync( path )

	if ( !exists ) {
		Errorer(
			`File  path  ${path} provided was invalid. Please enter a valid error`,
		)
	}
}

const getFileName = ( path ) => {
	const { ext } = getFileExtension( path )
	return nodePath.basename( path, ext )
}

const getFileExtension = ( path ) => {
	const ext = nodePath.extname( path )
	const extWithoutDot = ext.substring( 1, ext.length )
	return { ext, extWithoutDot }
}

const program = new Command()
program
	.argument( "<path>", "audio file path" )
	.option( "-t, --from-text <text-path>", "text file to read timestamps from" )
	.option(
		"-l, --list [timestamps...]",
		"give timestamps as a comma separated list",
	)
	.option(
		"-p, --output-path <path>",
		"override default output path",
		process.cwd(),
	)
	.action( async ( filePath, opts ) => {
		const { fromText, list, outputPath } = opts

		let timeStamps
		if ( fromText ) {
			validatePath( fromText )
			timeStamps = readFile( fromText )
		} else if ( list ) {
			timeStamps = list
		} else Errorer( "Please provide timestamps" )

		const timeStampsAsSeconds = timeStamps.map( ( time ) =>
			parseTimeToSeconds( time )
		)

		if ( timeStampsAsSeconds[ 0 ] !== 0 ) timeStampsAsSeconds.unshift( 0 )

		const inputName = getFileName( filePath )
		const { extWithoutDot: ext } = getFileExtension( filePath )

		const progressBar = new cliProgress.MultiBar(
			{ hideCursor: true },
			cliProgress.Presets.shades_classic,
		)

		timeStampsAsSeconds.forEach( async ( time, index ) => {
			let ffmpegCommand = ffmpeg( filePath ).outputOption( "-c:v copy" )
			// skip the first element, because it 0 and won't cut anything
			if ( index == 0 && time == 0 ) return

			const taskProgressBar = progressBar.create( 100, 0 )
			const onProgress = ( bar, data ) => {
				bar.update( data.percent )
			}
			// on the last elem, cut til the end
			if ( index == timeStampsAsSeconds.length - 1 ) {
				ffmpegCommand = ffmpegCommand.setStartTime( time )

				const timeNotSecond = timeStamps[ index - 1 ]
				const outputName =
          `${outputPath}/${timeNotSecond}-to-end-${inputName}.${ext}`
				ffmpegPromise(
					ffmpegCommand,
					outputName,
					taskProgressBar,
					onProgress,
					() => {},
				).then( () => {
					progressBar.stop()
					console.log( "Finish" )
				} )
			}
			const prevTime = timeStampsAsSeconds[ index - 1 ]
			const length = time - prevTime

			const prevTimeNotSecond = index == 1 ? 0 : timeStamps[ index - 2 ]
			const timeNotSecond = timeStamps[ index - 1 ]

			ffmpegCommand = ffmpegCommand.setStartTime( prevTime ).duration( length )
			const outputName =
        `${outputPath}/${prevTimeNotSecond}-to-${timeNotSecond}-${inputName}.${ext}`
			ffmpegPromise(
				ffmpegCommand,
				outputName,
				taskProgressBar,
				onProgress,
				() => {},
			)
		} )
	} )
// program.exitOverride();
// try {
program.parse( process.argv )
// } catch (err) {
//   console.log(err);
// }
