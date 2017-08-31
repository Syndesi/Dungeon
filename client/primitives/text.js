import pixiMultistyleText from 'pixi-multistyle-text';

/**
 * A small wrapper for {@link https://www.npmjs.com/package/pixi-multistyle-text| pixi-multistyle-text} so that special tags, mainly for colored text, are always accessible.<br>
 * These tags are supported:
 * ```
 * <c></c>             // red text
 * <6></6>             // orange text
 * <e></e>             // yellow text
 * <a></a>             // green text
 * <9></9>             // blue text
 * <d></d>             // purple text
 * <0></0>             // black text
 * <f></f>             // white text
 * <o></o>             // italic text
 * ```
 * @example
 * var text = new Text('Hello world :)');
 * game.addChild(text);
 */
class Text extends pixiMultistyleText {

  /**
   * Creates a new text-element.
   * @param  {string} text     the text which should be displayed
   * @param  {int}    x        the x-coordinate of this function, deprecated
   * @param  {int}    y        the y-coordinate of this function, deprecated
   * @param  {int}    fontSize the default fontSize of the displayed text
   * @param  {hex}    color    the default color in which the text should be displayed
   */
  constructor(text, x = 0, y = 0, fontSize = 8, color = 0xFFFFFF){
    super(text, {
      'default': {
        fontFamily: 'forward',
        fontSize:   fontSize,
        fill:       color
      },
      // using the Minecraft color codes
      'c': {  // red
        fill: "#da1818"
      },
      '6': {  // orange
        fill: "#da5c18"
      },
      'e': {  // yellow
        fill: "#e7df26"
      },
      'a': {  // green
        fill: "#3eda18"
      },
      '9': {  // blue
        fill: "#186dda"
      },
      'd': {  // purple
        fill: "#7b18da"
      },
      '0': {  // black
        fill: "#383838"
      },
      'f': {  // white
        fill: "#c9c9c9"
      },
      'o': {  // italic
        fontStyle: 'italic'
      }
    });
    this.position.x = x;
    this.position.y = y;
  }

}

export default Text;