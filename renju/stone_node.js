//
// Extension bytes
//
const BOARD_TEXT = 0x000100;

//
// Low byte
//
const DOWN = 0x80;
const RIGHT = 0x40;
const OLD_COMMENT = 0x20;
const MARK = 0x10;
const COMMENT = 0x08;
const START = 0x04;
const NO_MOVE = 0x02;
const EXTENSION = 0x01;

class StoneNode {
  constructor(byte1, byte2) {
    console.log('stonenode construct ', byte1, byte2);
    if (byte1 == 0) {
      this.x = 0; 
      this.y = 0;
    } else {
      this.x = parseInt(byte1 % 16);
      this.y = parseInt(byte1 / 16 + 1);
    }
    console.log('x:', this.x, 'y:', this.y);

    this.info = byte2;

    this.oneLineComment = "";
    this.multiLineComment = "";
    this.boardText = "";

    this.child = null;
    this.next_sibling = null;
  }

  hasExtendInfo() {
    return (this.info & EXTENSION) != 0;
  }
  setExtendInfo(byte1, byte2) {
  
  }

  hasOldComment() {
    return (this.info & OLD_COMMENT) != 0;
  }
  setOldComment(str) {

  }
  hasNewComment() {
    return (this.info & COMMENT) != 0;
  }
  setNewComment(str) {

  }

  hasBoardText() {

  }
  setBoardText(str) {

  }


}

export {StoneNode};