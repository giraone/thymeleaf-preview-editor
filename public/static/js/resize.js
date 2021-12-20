class Resizer {
  constructor(elements, bars, barPixelSize, reservedPixelSize, resizeVertical) {
    this.elements = elements;
    this.dims = new Array(this.elements.length);
    this.dims.fill(0);
    this.bars = bars;

    this.barPixelSize = barPixelSize;
    this.reservedPixelSize = reservedPixelSize;
    this.resizeVertical = resizeVertical;
    this.lastPos = 0;
    this.limitTopLeft = 15;
    this.limitBottomRight = 15; // 15+20, wenn nicht overflow:hidden wg. scrollbar

    this.mouseDownListeners = new Array(this.bars.length);
    this.mouseMoveListeners = new Array(this.bars.length);
    this.mouseUpListeners = new Array(this.bars.length);
    for (let i = 0; i < this.bars.length; i++) {
      this.mouseDownListeners[i] = (e) => this._mouseDown(e, i);
      this.mouseMoveListeners[i] = (e) => this._mouseMove(e, i);
      this.mouseUpListeners[i] = (e) => this._mouseUp(e, i);
    }
  }

  init() {
    for (let i = 0; i < this.bars.length; i++) {
      this.bars[i].addEventListener('mousedown', this.mouseDownListeners[i], false);
    }
  }

  getStatus() {
    let d = null;
    this.dims.forEach(dim => {
      if (d) {
        d += `, ${dim}`
      } else {
        d = dim;
      }
    });
    return `{ pos: ${this.lastPos}, dim: [${d}]}`;
  }

  _mouseDown(e, index1) {
    // console.log(`>>> _mouseDown >>> ${index1} ${e.target.id}`);
    this._storePos(this.resizeVertical ? e.clientY : e.clientX, index1, index1 + 1);
    this._addEventListeners(index1);
  }

  _mouseMove(e, index1) {
    // console.log(`>>> _mouseMove >>> ${index1} ${e.target.id}`);
    let index2 = index1 + 1;

    let delta;
    let pos;
    if (this.resizeVertical) {
      pos = e.clientY;
      delta = e.clientY - this.lastPos;
    } else {
      pos = e.clientX;
      delta = e.clientX - this.lastPos;
    }

    const elem1Dim = this.dims[index1] + delta;
    if (elem1Dim < this.limitTopLeft) {
      console.log('Blocked, because to small!');
      this._removeEventListeners(index1);
      return;
    }
    const elem2Dim = this.dims[index2] - delta;
    if (elem2Dim - this.reservedPixelSize < this.limitBottomRight) {
      console.log('Blocked, because to large!');
      this._removeEventListeners(index1);
      return;
    }

    if (this.resizeVertical) {
      this.elements[index1].style.height = elem1Dim + 'px';
      this.bars[index1].style.top = elem1Dim + 'px';
      this.elements[index2].style.top = elem1Dim + this.barPixelSize + 'px';
      this.elements[index2].style.height = elem2Dim + 'px';
    } else {
      this.elements[index1].style.width = elem1Dim + 'px';
      this.bars[index1].style.left = elem1Dim + 'px';
      this.elements[index2].style.left = elem1Dim + this.barPixelSize + 'px';
      this.elements[index2].style.width = elem2Dim + 'px';
    }

    this._storePos(pos, index1, index2);
    // console.log(this.getStatus());
    return true;
  }

  _mouseUp(e, index1) {
    console.log(`>>> _mouseUp >>> ${index1} ${e.target.id}`);
    this._removeEventListeners(index1);
  }

  _addEventListeners(index1) {
    document.documentElement.addEventListener(
      'mouseup',
      this.mouseUpListeners[index1],
      true
    );
    document.documentElement.addEventListener(
      'mousemove',
      this.mouseMoveListeners[index1],
      true
    );
  }
  _removeEventListeners(index1) {
    document.documentElement.removeEventListener(
      'mousemove',
      this.mouseMoveListeners[index1],
      true
    );
    document.documentElement.removeEventListener(
      'mouseup',
      this.mouseUpListeners[index1],
      true
    );
  }

  _storePos(pos, index1, index2) {
    // console.log(`>>> _storePos >>> ${pos} ${index1} ${index2}`);
    this.lastPos = pos;
    if (this.resizeVertical) {  
      const cssOf1 = document.defaultView.getComputedStyle(this.elements[index1]);
      this.dims[index1] = parseInt(cssOf1.height, 10);
      const cssOf2 = document.defaultView.getComputedStyle(this.elements[index2]);
      this.dims[index2] = parseInt(cssOf2.height, 10);
    } else {
      const cssOf1 = document.defaultView.getComputedStyle(this.elements[index1]);
      this.dims[index1] = parseInt(cssOf1.width, 10);
      const cssOf2 = document.defaultView.getComputedStyle(this.elements[index2]);
      this.dims[index2] = parseInt(cssOf2.width, 10);
    }
    this.lastPos = pos;
    return index1;
  }
}
