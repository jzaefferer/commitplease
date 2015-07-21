var scissor = /# ------------------------ >8 ------------------------[\s\S]+/;
module.exports = function( value ) {
	return value.replace( scissor, "" ).split( /\n/ ).filter( function( line ) {
		return !/^#/.test( line );
	} ).join( "\n" ).trim();
};
