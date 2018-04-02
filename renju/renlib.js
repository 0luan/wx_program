import {StoneNode} from "stone_node.js"

export function RenLibParser() {
  var i = 20;
  var buf;

  return {
    /* buf : Uint8Array */
    load: function(buf) {
      this.buf = buf;
      const header = [255, 82, 101, 110, 76, 105, 98, 255];
      var tmp = buf.slice(0, 8);
      if (tmp.toString() != header.toString()) {
        console.log('not a renlib file');
        return;
      }

      // read version info
      const major_version = buf[8];
      const minor_version = buf[9];
      console.log('version:' + major_version + '.' + minor_version);

      this.getNode();
      this.getNode();
    },

    getNode: function() {
      let byte1 = this.buf[i];
      ++i;
      let byte2 = this.buf[i];
      ++i;
      var node = new StoneNode(byte1, byte2);
      if (node.hasExtendInfo()) {
        console.log('has ext info');
        let byte1 = buf[i];
        ++i;
        let byte2 = buf[i];
        ++i;
        node.setExtendInfo(byte1, byte2);
      }

      if (node.hasOldComment()) {
        console.log('has old comment');

      }

      if (node.hasNewComment()) {
        console.log('has new comment');

      }


    },

    readOldComment: function() {

    },
    readNewComment: function() {

    }

  }
};