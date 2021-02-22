webpackJsonpac__name_([1],{

/***/ "./node_modules/asn1js/build/asn1.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromBER = fromBER;
exports.compareSchema = compareSchema;
exports.verifySchema = verifySchema;
exports.fromJSON = fromJSON;
exports.RawData = exports.Repeated = exports.Any = exports.Choice = exports.TIME = exports.Duration = exports.DateTime = exports.TimeOfDay = exports.DATE = exports.GeneralizedTime = exports.UTCTime = exports.CharacterString = exports.GeneralString = exports.VisibleString = exports.GraphicString = exports.IA5String = exports.VideotexString = exports.TeletexString = exports.PrintableString = exports.NumericString = exports.UniversalString = exports.BmpString = exports.RelativeObjectIdentifier = exports.Utf8String = exports.ObjectIdentifier = exports.Enumerated = exports.Integer = exports.BitString = exports.OctetString = exports.Null = exports.Set = exports.Sequence = exports.Boolean = exports.EndOfContent = exports.Constructed = exports.Primitive = exports.BaseBlock = exports.ValueBlock = exports.HexBlock = void 0;

var _pvutils = __webpack_require__("./node_modules/pvutils/src/utils.js");

/* eslint-disable indent */

/*
 * Copyright (c) 2016-2018, Peculiar Ventures
 * All rights reserved.
 *
 * Author 2016-2018, Yury Strozhevsky <www.strozhevsky.com>.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 * IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 * NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY
 * OF SUCH DAMAGE.
 *
 */
//**************************************************************************************
//**************************************************************************************
//region Declaration of global variables
//**************************************************************************************
const powers2 = [new Uint8Array([1])];
const digitsString = "0123456789"; //**************************************************************************************
//endregion
//**************************************************************************************
//region Declaration for "LocalBaseBlock" class
//**************************************************************************************

/**
 * Class used as a base block for all remaining ASN.1 classes
 * @typedef LocalBaseBlock
 * @interface
 * @property {number} blockLength
 * @property {string} error
 * @property {Array.<string>} warnings
 * @property {ArrayBuffer} valueBeforeDecode
 */

class LocalBaseBlock {
  //**********************************************************************************

  /**
   * Constructor for "LocalBaseBlock" class
   * @param {Object} [parameters={}]
   * @property {ArrayBuffer} [valueBeforeDecode]
   */
  constructor(parameters = {}) {
    /**
     * @type {number} blockLength
     */
    this.blockLength = (0, _pvutils.getParametersValue)(parameters, "blockLength", 0);
    /**
     * @type {string} error
     */

    this.error = (0, _pvutils.getParametersValue)(parameters, "error", "");
    /**
     * @type {Array.<string>} warnings
     */

    this.warnings = (0, _pvutils.getParametersValue)(parameters, "warnings", []); //noinspection JSCheckFunctionSignatures

    /**
     * @type {ArrayBuffer} valueBeforeDecode
     */

    if ("valueBeforeDecode" in parameters) this.valueBeforeDecode = parameters.valueBeforeDecode.slice(0);else this.valueBeforeDecode = new ArrayBuffer(0);
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "baseBlock";
  } //**********************************************************************************

  /**
   * Convertion for the block to JSON object
   * @returns {{blockName: string, blockLength: number, error: string, warnings: Array.<string>, valueBeforeDecode: string}}
   */


  toJSON() {
    return {
      blockName: this.constructor.blockName(),
      blockLength: this.blockLength,
      error: this.error,
      warnings: this.warnings,
      valueBeforeDecode: (0, _pvutils.bufferToHexCodes)(this.valueBeforeDecode, 0, this.valueBeforeDecode.byteLength)
    };
  } //**********************************************************************************


} //**************************************************************************************
//endregion
//**************************************************************************************
//region Description for "HexBlock" class
//**************************************************************************************

/**
 * Class used as a base block for all remaining ASN.1 classes
 * @extends LocalBaseBlock
 * @typedef HexBlock
 * @property {number} blockLength
 * @property {string} error
 * @property {Array.<string>} warnings
 * @property {ArrayBuffer} valueBeforeDecode
 * @property {boolean} isHexOnly
 * @property {ArrayBuffer} valueHex
 */
//noinspection JSUnusedLocalSymbols


const HexBlock = BaseClass => class LocalHexBlockMixin extends BaseClass {
  //**********************************************************************************
  //noinspection JSUnusedGlobalSymbols

  /**
   * Constructor for "HexBlock" class
   * @param {Object} [parameters={}]
   * @property {ArrayBuffer} [valueHex]
   */
  constructor(parameters = {}) {
    super(parameters);
    /**
     * @type {boolean}
     */

    this.isHexOnly = (0, _pvutils.getParametersValue)(parameters, "isHexOnly", false);
    /**
     * @type {ArrayBuffer}
     */

    if ("valueHex" in parameters) this.valueHex = parameters.valueHex.slice(0);else this.valueHex = new ArrayBuffer(0);
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "hexBlock";
  } //**********************************************************************************

  /**
   * Base function for converting block from BER encoded array of bytes
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   * @param {!number} inputOffset Offset in ASN.1 BER encoded array where decoding should be started
   * @param {!number} inputLength Maximum length of array of bytes which can be using in this function
   * @returns {number} Offset after least decoded byte
   */


  fromBER(inputBuffer, inputOffset, inputLength) {
    //region Basic check for parameters
    //noinspection JSCheckFunctionSignatures
    if ((0, _pvutils.checkBufferParams)(this, inputBuffer, inputOffset, inputLength) === false) return -1; //endregion
    //region Getting Uint8Array from ArrayBuffer

    const intBuffer = new Uint8Array(inputBuffer, inputOffset, inputLength); //endregion
    //region Initial checks

    if (intBuffer.length === 0) {
      this.warnings.push("Zero buffer length");
      return inputOffset;
    } //endregion
    //region Copy input buffer to internal buffer


    this.valueHex = inputBuffer.slice(inputOffset, inputOffset + inputLength); //endregion

    this.blockLength = inputLength;
    return inputOffset + inputLength;
  } //**********************************************************************************

  /**
   * Encoding of current ASN.1 block into ASN.1 encoded array (BER rules)
   * @param {boolean} [sizeOnly=false] Flag that we need only a size of encoding, not a real array of bytes
   * @returns {ArrayBuffer}
   */


  toBER(sizeOnly = false) {
    if (this.isHexOnly !== true) {
      this.error = "Flag \"isHexOnly\" is not set, abort";
      return new ArrayBuffer(0);
    }

    if (sizeOnly === true) return new ArrayBuffer(this.valueHex.byteLength); //noinspection JSCheckFunctionSignatures

    return this.valueHex.slice(0);
  } //**********************************************************************************

  /**
   * Convertion for the block to JSON object
   * @returns {Object}
   */


  toJSON() {
    let object = {}; //region Seems at the moment (Sep 2016) there is no way how to check method is supported in "super" object

    try {
      object = super.toJSON();
    } catch (ex) {} //endregion


    object.blockName = this.constructor.blockName();
    object.isHexOnly = this.isHexOnly;
    object.valueHex = (0, _pvutils.bufferToHexCodes)(this.valueHex, 0, this.valueHex.byteLength);
    return object;
  } //**********************************************************************************


}; //**************************************************************************************
//endregion
//**************************************************************************************
//region Declaration of identification block class
//**************************************************************************************


exports.HexBlock = HexBlock;

class LocalIdentificationBlock extends HexBlock(LocalBaseBlock) {
  //**********************************************************************************

  /**
   * Constructor for "LocalBaseBlock" class
   * @param {Object} [parameters={}]
   * @property {Object} [idBlock]
   */
  constructor(parameters = {}) {
    super();

    if ("idBlock" in parameters) {
      //region Properties from hexBlock class
      this.isHexOnly = (0, _pvutils.getParametersValue)(parameters.idBlock, "isHexOnly", false);
      this.valueHex = (0, _pvutils.getParametersValue)(parameters.idBlock, "valueHex", new ArrayBuffer(0)); //endregion

      this.tagClass = (0, _pvutils.getParametersValue)(parameters.idBlock, "tagClass", -1);
      this.tagNumber = (0, _pvutils.getParametersValue)(parameters.idBlock, "tagNumber", -1);
      this.isConstructed = (0, _pvutils.getParametersValue)(parameters.idBlock, "isConstructed", false);
    } else {
      this.tagClass = -1;
      this.tagNumber = -1;
      this.isConstructed = false;
    }
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "identificationBlock";
  } //**********************************************************************************

  /**
   * Encoding of current ASN.1 block into ASN.1 encoded array (BER rules)
   * @param {boolean} [sizeOnly=false] Flag that we need only a size of encoding, not a real array of bytes
   * @returns {ArrayBuffer}
   */


  toBER(sizeOnly = false) {
    //region Initial variables
    let firstOctet = 0;
    let retBuf;
    let retView; //endregion

    switch (this.tagClass) {
      case 1:
        firstOctet |= 0x00; // UNIVERSAL

        break;

      case 2:
        firstOctet |= 0x40; // APPLICATION

        break;

      case 3:
        firstOctet |= 0x80; // CONTEXT-SPECIFIC

        break;

      case 4:
        firstOctet |= 0xC0; // PRIVATE

        break;

      default:
        this.error = "Unknown tag class";
        return new ArrayBuffer(0);
    }

    if (this.isConstructed) firstOctet |= 0x20;

    if (this.tagNumber < 31 && !this.isHexOnly) {
      retBuf = new ArrayBuffer(1);
      retView = new Uint8Array(retBuf);

      if (!sizeOnly) {
        let number = this.tagNumber;
        number &= 0x1F;
        firstOctet |= number;
        retView[0] = firstOctet;
      }

      return retBuf;
    }

    if (this.isHexOnly === false) {
      const encodedBuf = (0, _pvutils.utilToBase)(this.tagNumber, 7);
      const encodedView = new Uint8Array(encodedBuf);
      const size = encodedBuf.byteLength;
      retBuf = new ArrayBuffer(size + 1);
      retView = new Uint8Array(retBuf);
      retView[0] = firstOctet | 0x1F;

      if (!sizeOnly) {
        for (let i = 0; i < size - 1; i++) retView[i + 1] = encodedView[i] | 0x80;

        retView[size] = encodedView[size - 1];
      }

      return retBuf;
    }

    retBuf = new ArrayBuffer(this.valueHex.byteLength + 1);
    retView = new Uint8Array(retBuf);
    retView[0] = firstOctet | 0x1F;

    if (sizeOnly === false) {
      const curView = new Uint8Array(this.valueHex);

      for (let i = 0; i < curView.length - 1; i++) retView[i + 1] = curView[i] | 0x80;

      retView[this.valueHex.byteLength] = curView[curView.length - 1];
    }

    return retBuf;
  } //**********************************************************************************

  /**
   * Base function for converting block from BER encoded array of bytes
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   * @param {!number} inputOffset Offset in ASN.1 BER encoded array where decoding should be started
   * @param {!number} inputLength Maximum length of array of bytes which can be using in this function
   * @returns {number}
   */


  fromBER(inputBuffer, inputOffset, inputLength) {
    //region Basic check for parameters
    //noinspection JSCheckFunctionSignatures
    if ((0, _pvutils.checkBufferParams)(this, inputBuffer, inputOffset, inputLength) === false) return -1; //endregion
    //region Getting Uint8Array from ArrayBuffer

    const intBuffer = new Uint8Array(inputBuffer, inputOffset, inputLength); //endregion
    //region Initial checks

    if (intBuffer.length === 0) {
      this.error = "Zero buffer length";
      return -1;
    } //endregion
    //region Find tag class


    const tagClassMask = intBuffer[0] & 0xC0;

    switch (tagClassMask) {
      case 0x00:
        this.tagClass = 1; // UNIVERSAL

        break;

      case 0x40:
        this.tagClass = 2; // APPLICATION

        break;

      case 0x80:
        this.tagClass = 3; // CONTEXT-SPECIFIC

        break;

      case 0xC0:
        this.tagClass = 4; // PRIVATE

        break;

      default:
        this.error = "Unknown tag class";
        return -1;
    } //endregion
    //region Find it's constructed or not


    this.isConstructed = (intBuffer[0] & 0x20) === 0x20; //endregion
    //region Find tag number

    this.isHexOnly = false;
    const tagNumberMask = intBuffer[0] & 0x1F; //region Simple case (tag number < 31)

    if (tagNumberMask !== 0x1F) {
      this.tagNumber = tagNumberMask;
      this.blockLength = 1;
    } //endregion
    //region Tag number bigger or equal to 31
    else {
        let count = 1;
        this.valueHex = new ArrayBuffer(255);
        let tagNumberBufferMaxLength = 255;
        let intTagNumberBuffer = new Uint8Array(this.valueHex); //noinspection JSBitwiseOperatorUsage

        while (intBuffer[count] & 0x80) {
          intTagNumberBuffer[count - 1] = intBuffer[count] & 0x7F;
          count++;

          if (count >= intBuffer.length) {
            this.error = "End of input reached before message was fully decoded";
            return -1;
          } //region In case if tag number length is greater than 255 bytes (rare but possible case)


          if (count === tagNumberBufferMaxLength) {
            tagNumberBufferMaxLength += 255;
            const tempBuffer = new ArrayBuffer(tagNumberBufferMaxLength);
            const tempBufferView = new Uint8Array(tempBuffer);

            for (let i = 0; i < intTagNumberBuffer.length; i++) tempBufferView[i] = intTagNumberBuffer[i];

            this.valueHex = new ArrayBuffer(tagNumberBufferMaxLength);
            intTagNumberBuffer = new Uint8Array(this.valueHex);
          } //endregion

        }

        this.blockLength = count + 1;
        intTagNumberBuffer[count - 1] = intBuffer[count] & 0x7F; // Write last byte to buffer
        //region Cut buffer

        const tempBuffer = new ArrayBuffer(count);
        const tempBufferView = new Uint8Array(tempBuffer);

        for (let i = 0; i < count; i++) tempBufferView[i] = intTagNumberBuffer[i];

        this.valueHex = new ArrayBuffer(count);
        intTagNumberBuffer = new Uint8Array(this.valueHex);
        intTagNumberBuffer.set(tempBufferView); //endregion
        //region Try to convert long tag number to short form

        if (this.blockLength <= 9) this.tagNumber = (0, _pvutils.utilFromBase)(intTagNumberBuffer, 7);else {
          this.isHexOnly = true;
          this.warnings.push("Tag too long, represented as hex-coded");
        } //endregion
      } //endregion
    //endregion
    //region Check if constructed encoding was using for primitive type


    if (this.tagClass === 1 && this.isConstructed) {
      switch (this.tagNumber) {
        case 1: // Boolean

        case 2: // REAL

        case 5: // Null

        case 6: // OBJECT IDENTIFIER

        case 9: // REAL

        case 13: // RELATIVE OBJECT IDENTIFIER

        case 14: // Time

        case 23:
        case 24:
        case 31:
        case 32:
        case 33:
        case 34:
          this.error = "Constructed encoding used for primitive type";
          return -1;

        default:
      }
    } //endregion


    return inputOffset + this.blockLength; // Return current offset in input buffer
  } //**********************************************************************************

  /**
   * Convertion for the block to JSON object
   * @returns {{blockName: string,
   *  tagClass: number,
   *  tagNumber: number,
   *  isConstructed: boolean,
   *  isHexOnly: boolean,
   *  valueHex: ArrayBuffer,
   *  blockLength: number,
   *  error: string, warnings: Array.<string>,
   *  valueBeforeDecode: string}}
   */


  toJSON() {
    let object = {}; //region Seems at the moment (Sep 2016) there is no way how to check method is supported in "super" object

    try {
      object = super.toJSON();
    } catch (ex) {} //endregion


    object.blockName = this.constructor.blockName();
    object.tagClass = this.tagClass;
    object.tagNumber = this.tagNumber;
    object.isConstructed = this.isConstructed;
    return object;
  } //**********************************************************************************


} //**************************************************************************************
//endregion
//**************************************************************************************
//region Declaration of length block class
//**************************************************************************************


class LocalLengthBlock extends LocalBaseBlock {
  //**********************************************************************************

  /**
   * Constructor for "LocalLengthBlock" class
   * @param {Object} [parameters={}]
   * @property {Object} [lenBlock]
   */
  constructor(parameters = {}) {
    super();

    if ("lenBlock" in parameters) {
      this.isIndefiniteForm = (0, _pvutils.getParametersValue)(parameters.lenBlock, "isIndefiniteForm", false);
      this.longFormUsed = (0, _pvutils.getParametersValue)(parameters.lenBlock, "longFormUsed", false);
      this.length = (0, _pvutils.getParametersValue)(parameters.lenBlock, "length", 0);
    } else {
      this.isIndefiniteForm = false;
      this.longFormUsed = false;
      this.length = 0;
    }
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "lengthBlock";
  } //**********************************************************************************

  /**
   * Base function for converting block from BER encoded array of bytes
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   * @param {!number} inputOffset Offset in ASN.1 BER encoded array where decoding should be started
   * @param {!number} inputLength Maximum length of array of bytes which can be using in this function
   * @returns {number}
   */


  fromBER(inputBuffer, inputOffset, inputLength) {
    //region Basic check for parameters
    //noinspection JSCheckFunctionSignatures
    if ((0, _pvutils.checkBufferParams)(this, inputBuffer, inputOffset, inputLength) === false) return -1; //endregion
    //region Getting Uint8Array from ArrayBuffer

    const intBuffer = new Uint8Array(inputBuffer, inputOffset, inputLength); //endregion
    //region Initial checks

    if (intBuffer.length === 0) {
      this.error = "Zero buffer length";
      return -1;
    }

    if (intBuffer[0] === 0xFF) {
      this.error = "Length block 0xFF is reserved by standard";
      return -1;
    } //endregion
    //region Check for length form type


    this.isIndefiniteForm = intBuffer[0] === 0x80; //endregion
    //region Stop working in case of indefinite length form

    if (this.isIndefiniteForm === true) {
      this.blockLength = 1;
      return inputOffset + this.blockLength;
    } //endregion
    //region Check is long form of length encoding using


    this.longFormUsed = !!(intBuffer[0] & 0x80); //endregion
    //region Stop working in case of short form of length value

    if (this.longFormUsed === false) {
      this.length = intBuffer[0];
      this.blockLength = 1;
      return inputOffset + this.blockLength;
    } //endregion
    //region Calculate length value in case of long form


    const count = intBuffer[0] & 0x7F;

    if (count > 8) // Too big length value
      {
        this.error = "Too big integer";
        return -1;
      }

    if (count + 1 > intBuffer.length) {
      this.error = "End of input reached before message was fully decoded";
      return -1;
    }

    const lengthBufferView = new Uint8Array(count);

    for (let i = 0; i < count; i++) lengthBufferView[i] = intBuffer[i + 1];

    if (lengthBufferView[count - 1] === 0x00) this.warnings.push("Needlessly long encoded length");
    this.length = (0, _pvutils.utilFromBase)(lengthBufferView, 8);
    if (this.longFormUsed && this.length <= 127) this.warnings.push("Unneccesary usage of long length form");
    this.blockLength = count + 1; //endregion

    return inputOffset + this.blockLength; // Return current offset in input buffer
  } //**********************************************************************************

  /**
   * Encoding of current ASN.1 block into ASN.1 encoded array (BER rules)
   * @param {boolean} [sizeOnly=false] Flag that we need only a size of encoding, not a real array of bytes
   * @returns {ArrayBuffer}
   */


  toBER(sizeOnly = false) {
    //region Initial variables
    let retBuf;
    let retView; //endregion

    if (this.length > 127) this.longFormUsed = true;

    if (this.isIndefiniteForm) {
      retBuf = new ArrayBuffer(1);

      if (sizeOnly === false) {
        retView = new Uint8Array(retBuf);
        retView[0] = 0x80;
      }

      return retBuf;
    }

    if (this.longFormUsed === true) {
      const encodedBuf = (0, _pvutils.utilToBase)(this.length, 8);

      if (encodedBuf.byteLength > 127) {
        this.error = "Too big length";
        return new ArrayBuffer(0);
      }

      retBuf = new ArrayBuffer(encodedBuf.byteLength + 1);
      if (sizeOnly === true) return retBuf;
      const encodedView = new Uint8Array(encodedBuf);
      retView = new Uint8Array(retBuf);
      retView[0] = encodedBuf.byteLength | 0x80;

      for (let i = 0; i < encodedBuf.byteLength; i++) retView[i + 1] = encodedView[i];

      return retBuf;
    }

    retBuf = new ArrayBuffer(1);

    if (sizeOnly === false) {
      retView = new Uint8Array(retBuf);
      retView[0] = this.length;
    }

    return retBuf;
  } //**********************************************************************************

  /**
   * Convertion for the block to JSON object
   * @returns {{blockName, blockLength, error, warnings, valueBeforeDecode}|{blockName: string, blockLength: number, error: string, warnings: Array.<string>, valueBeforeDecode: string}}
   */


  toJSON() {
    let object = {}; //region Seems at the moment (Sep 2016) there is no way how to check method is supported in "super" object

    try {
      object = super.toJSON();
    } catch (ex) {} //endregion


    object.blockName = this.constructor.blockName();
    object.isIndefiniteForm = this.isIndefiniteForm;
    object.longFormUsed = this.longFormUsed;
    object.length = this.length;
    return object;
  } //**********************************************************************************


} //**************************************************************************************
//endregion
//**************************************************************************************
//region Declaration of value block class
//**************************************************************************************


class ValueBlock extends LocalBaseBlock {
  //**********************************************************************************

  /**
   * Constructor for "ValueBlock" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters);
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "valueBlock";
  } //**********************************************************************************
  //noinspection JSUnusedLocalSymbols,JSUnusedLocalSymbols,JSUnusedLocalSymbols

  /**
   * Base function for converting block from BER encoded array of bytes
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   * @param {!number} inputOffset Offset in ASN.1 BER encoded array where decoding should be started
   * @param {!number} inputLength Maximum length of array of bytes which can be using in this function
   * @returns {number}
   */


  fromBER(inputBuffer, inputOffset, inputLength) {
    //region Throw an exception for a function which needs to be specified in extended classes
    throw TypeError("User need to make a specific function in a class which extends \"ValueBlock\""); //endregion
  } //**********************************************************************************
  //noinspection JSUnusedLocalSymbols

  /**
   * Encoding of current ASN.1 block into ASN.1 encoded array (BER rules)
   * @param {boolean} [sizeOnly=false] Flag that we need only a size of encoding, not a real array of bytes
   * @returns {ArrayBuffer}
   */


  toBER(sizeOnly = false) {
    //region Throw an exception for a function which needs to be specified in extended classes
    throw TypeError("User need to make a specific function in a class which extends \"ValueBlock\""); //endregion
  } //**********************************************************************************


} //**************************************************************************************
//endregion
//**************************************************************************************
//region Declaration of basic ASN.1 block class
//**************************************************************************************


exports.ValueBlock = ValueBlock;

class BaseBlock extends LocalBaseBlock {
  //**********************************************************************************

  /**
   * Constructor for "BaseBlock" class
   * @param {Object} [parameters={}]
   * @property {Object} [primitiveSchema]
   * @property {string} [name]
   * @property {boolean} [optional]
   * @param valueBlockType Type of value block
   */
  constructor(parameters = {}, valueBlockType = ValueBlock) {
    super(parameters);
    if ("name" in parameters) this.name = parameters.name;
    if ("optional" in parameters) this.optional = parameters.optional;
    if ("primitiveSchema" in parameters) this.primitiveSchema = parameters.primitiveSchema;
    this.idBlock = new LocalIdentificationBlock(parameters);
    this.lenBlock = new LocalLengthBlock(parameters);
    this.valueBlock = new valueBlockType(parameters);
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "BaseBlock";
  } //**********************************************************************************

  /**
   * Base function for converting block from BER encoded array of bytes
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   * @param {!number} inputOffset Offset in ASN.1 BER encoded array where decoding should be started
   * @param {!number} inputLength Maximum length of array of bytes which can be using in this function
   * @returns {number}
   */


  fromBER(inputBuffer, inputOffset, inputLength) {
    const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm === true ? inputLength : this.lenBlock.length);

    if (resultOffset === -1) {
      this.error = this.valueBlock.error;
      return resultOffset;
    }

    if (this.idBlock.error.length === 0) this.blockLength += this.idBlock.blockLength;
    if (this.lenBlock.error.length === 0) this.blockLength += this.lenBlock.blockLength;
    if (this.valueBlock.error.length === 0) this.blockLength += this.valueBlock.blockLength;
    return resultOffset;
  } //**********************************************************************************

  /**
   * Encoding of current ASN.1 block into ASN.1 encoded array (BER rules)
   * @param {boolean} [sizeOnly=false] Flag that we need only a size of encoding, not a real array of bytes
   * @returns {ArrayBuffer}
   */


  toBER(sizeOnly = false) {
    let retBuf;
    const idBlockBuf = this.idBlock.toBER(sizeOnly);
    const valueBlockSizeBuf = this.valueBlock.toBER(true);
    this.lenBlock.length = valueBlockSizeBuf.byteLength;
    const lenBlockBuf = this.lenBlock.toBER(sizeOnly);
    retBuf = (0, _pvutils.utilConcatBuf)(idBlockBuf, lenBlockBuf);
    let valueBlockBuf;
    if (sizeOnly === false) valueBlockBuf = this.valueBlock.toBER(sizeOnly);else valueBlockBuf = new ArrayBuffer(this.lenBlock.length);
    retBuf = (0, _pvutils.utilConcatBuf)(retBuf, valueBlockBuf);

    if (this.lenBlock.isIndefiniteForm === true) {
      const indefBuf = new ArrayBuffer(2);

      if (sizeOnly === false) {
        const indefView = new Uint8Array(indefBuf);
        indefView[0] = 0x00;
        indefView[1] = 0x00;
      }

      retBuf = (0, _pvutils.utilConcatBuf)(retBuf, indefBuf);
    }

    return retBuf;
  } //**********************************************************************************

  /**
   * Convertion for the block to JSON object
   * @returns {{blockName, blockLength, error, warnings, valueBeforeDecode}|{blockName: string, blockLength: number, error: string, warnings: Array.<string>, valueBeforeDecode: string}}
   */


  toJSON() {
    let object = {}; //region Seems at the moment (Sep 2016) there is no way how to check method is supported in "super" object

    try {
      object = super.toJSON();
    } catch (ex) {} //endregion


    object.idBlock = this.idBlock.toJSON();
    object.lenBlock = this.lenBlock.toJSON();
    object.valueBlock = this.valueBlock.toJSON();
    if ("name" in this) object.name = this.name;
    if ("optional" in this) object.optional = this.optional;
    if ("primitiveSchema" in this) object.primitiveSchema = this.primitiveSchema.toJSON();
    return object;
  } //**********************************************************************************


} //**************************************************************************************
//endregion
//**************************************************************************************
//region Declaration of basic block for all PRIMITIVE types
//**************************************************************************************


exports.BaseBlock = BaseBlock;

class LocalPrimitiveValueBlock extends ValueBlock {
  //**********************************************************************************

  /**
   * Constructor for "LocalPrimitiveValueBlock" class
   * @param {Object} [parameters={}]
   * @property {ArrayBuffer} [valueBeforeDecode]
   */
  constructor(parameters = {}) {
    super(parameters); //region Variables from "hexBlock" class

    if ("valueHex" in parameters) this.valueHex = parameters.valueHex.slice(0);else this.valueHex = new ArrayBuffer(0);
    this.isHexOnly = (0, _pvutils.getParametersValue)(parameters, "isHexOnly", true); //endregion
  } //**********************************************************************************

  /**
   * Base function for converting block from BER encoded array of bytes
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   * @param {!number} inputOffset Offset in ASN.1 BER encoded array where decoding should be started
   * @param {!number} inputLength Maximum length of array of bytes which can be using in this function
   * @returns {number}
   */


  fromBER(inputBuffer, inputOffset, inputLength) {
    //region Basic check for parameters
    //noinspection JSCheckFunctionSignatures
    if ((0, _pvutils.checkBufferParams)(this, inputBuffer, inputOffset, inputLength) === false) return -1; //endregion
    //region Getting Uint8Array from ArrayBuffer

    const intBuffer = new Uint8Array(inputBuffer, inputOffset, inputLength); //endregion
    //region Initial checks

    if (intBuffer.length === 0) {
      this.warnings.push("Zero buffer length");
      return inputOffset;
    } //endregion
    //region Copy input buffer into internal buffer


    this.valueHex = new ArrayBuffer(intBuffer.length);
    const valueHexView = new Uint8Array(this.valueHex);

    for (let i = 0; i < intBuffer.length; i++) valueHexView[i] = intBuffer[i]; //endregion


    this.blockLength = inputLength;
    return inputOffset + inputLength;
  } //**********************************************************************************
  //noinspection JSUnusedLocalSymbols

  /**
   * Encoding of current ASN.1 block into ASN.1 encoded array (BER rules)
   * @param {boolean} [sizeOnly=false] Flag that we need only a size of encoding, not a real array of bytes
   * @returns {ArrayBuffer}
   */


  toBER(sizeOnly = false) {
    return this.valueHex.slice(0);
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "PrimitiveValueBlock";
  } //**********************************************************************************

  /**
   * Convertion for the block to JSON object
   * @returns {{blockName, blockLength, error, warnings, valueBeforeDecode}|{blockName: string, blockLength: number, error: string, warnings: Array.<string>, valueBeforeDecode: string}}
   */


  toJSON() {
    let object = {}; //region Seems at the moment (Sep 2016) there is no way how to check method is supported in "super" object

    try {
      object = super.toJSON();
    } catch (ex) {} //endregion


    object.valueHex = (0, _pvutils.bufferToHexCodes)(this.valueHex, 0, this.valueHex.byteLength);
    object.isHexOnly = this.isHexOnly;
    return object;
  } //**********************************************************************************


} //**************************************************************************************


class Primitive extends BaseBlock {
  //**********************************************************************************

  /**
   * Constructor for "Primitive" class
   * @param {Object} [parameters={}]
   * @property {ArrayBuffer} [valueHex]
   */
  constructor(parameters = {}) {
    super(parameters, LocalPrimitiveValueBlock);
    this.idBlock.isConstructed = false;
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "PRIMITIVE";
  } //**********************************************************************************


} //**************************************************************************************
//endregion
//**************************************************************************************
//region Declaration of basic block for all CONSTRUCTED types
//**************************************************************************************


exports.Primitive = Primitive;

class LocalConstructedValueBlock extends ValueBlock {
  //**********************************************************************************

  /**
   * Constructor for "LocalConstructedValueBlock" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters);
    this.value = (0, _pvutils.getParametersValue)(parameters, "value", []);
    this.isIndefiniteForm = (0, _pvutils.getParametersValue)(parameters, "isIndefiniteForm", false);
  } //**********************************************************************************

  /**
   * Base function for converting block from BER encoded array of bytes
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   * @param {!number} inputOffset Offset in ASN.1 BER encoded array where decoding should be started
   * @param {!number} inputLength Maximum length of array of bytes which can be using in this function
   * @returns {number}
   */


  fromBER(inputBuffer, inputOffset, inputLength) {
    //region Store initial offset and length
    const initialOffset = inputOffset;
    const initialLength = inputLength; //endregion
    //region Basic check for parameters
    //noinspection JSCheckFunctionSignatures

    if ((0, _pvutils.checkBufferParams)(this, inputBuffer, inputOffset, inputLength) === false) return -1; //endregion
    //region Getting Uint8Array from ArrayBuffer

    const intBuffer = new Uint8Array(inputBuffer, inputOffset, inputLength); //endregion
    //region Initial checks

    if (intBuffer.length === 0) {
      this.warnings.push("Zero buffer length");
      return inputOffset;
    } //endregion
    //region Aux function


    function checkLen(indefiniteLength, length) {
      if (indefiniteLength === true) return 1;
      return length;
    } //endregion


    let currentOffset = inputOffset;

    while (checkLen(this.isIndefiniteForm, inputLength) > 0) {
      const returnObject = LocalFromBER(inputBuffer, currentOffset, inputLength);

      if (returnObject.offset === -1) {
        this.error = returnObject.result.error;
        this.warnings.concat(returnObject.result.warnings);
        return -1;
      }

      currentOffset = returnObject.offset;
      this.blockLength += returnObject.result.blockLength;
      inputLength -= returnObject.result.blockLength;
      this.value.push(returnObject.result);
      if (this.isIndefiniteForm === true && returnObject.result.constructor.blockName() === EndOfContent.blockName()) break;
    }

    if (this.isIndefiniteForm === true) {
      if (this.value[this.value.length - 1].constructor.blockName() === EndOfContent.blockName()) this.value.pop();else this.warnings.push("No EndOfContent block encoded");
    } //region Copy "inputBuffer" to "valueBeforeDecode"


    this.valueBeforeDecode = inputBuffer.slice(initialOffset, initialOffset + initialLength); //endregion

    return currentOffset;
  } //**********************************************************************************

  /**
   * Encoding of current ASN.1 block into ASN.1 encoded array (BER rules)
   * @param {boolean} [sizeOnly=false] Flag that we need only a size of encoding, not a real array of bytes
   * @returns {ArrayBuffer}
   */


  toBER(sizeOnly = false) {
    let retBuf = new ArrayBuffer(0);

    for (let i = 0; i < this.value.length; i++) {
      const valueBuf = this.value[i].toBER(sizeOnly);
      retBuf = (0, _pvutils.utilConcatBuf)(retBuf, valueBuf);
    }

    return retBuf;
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "ConstructedValueBlock";
  } //**********************************************************************************

  /**
   * Convertion for the block to JSON object
   * @returns {{blockName, blockLength, error, warnings, valueBeforeDecode}|{blockName: string, blockLength: number, error: string, warnings: Array.<string>, valueBeforeDecode: string}}
   */


  toJSON() {
    let object = {}; //region Seems at the moment (Sep 2016) there is no way how to check method is supported in "super" object

    try {
      object = super.toJSON();
    } catch (ex) {} //endregion


    object.isIndefiniteForm = this.isIndefiniteForm;
    object.value = [];

    for (let i = 0; i < this.value.length; i++) object.value.push(this.value[i].toJSON());

    return object;
  } //**********************************************************************************


} //**************************************************************************************


class Constructed extends BaseBlock {
  //**********************************************************************************

  /**
   * Constructor for "Constructed" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters, LocalConstructedValueBlock);
    this.idBlock.isConstructed = true;
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "CONSTRUCTED";
  } //**********************************************************************************

  /**
   * Base function for converting block from BER encoded array of bytes
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   * @param {!number} inputOffset Offset in ASN.1 BER encoded array where decoding should be started
   * @param {!number} inputLength Maximum length of array of bytes which can be using in this function
   * @returns {number}
   */


  fromBER(inputBuffer, inputOffset, inputLength) {
    this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
    const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm === true ? inputLength : this.lenBlock.length);

    if (resultOffset === -1) {
      this.error = this.valueBlock.error;
      return resultOffset;
    }

    if (this.idBlock.error.length === 0) this.blockLength += this.idBlock.blockLength;
    if (this.lenBlock.error.length === 0) this.blockLength += this.lenBlock.blockLength;
    if (this.valueBlock.error.length === 0) this.blockLength += this.valueBlock.blockLength;
    return resultOffset;
  } //**********************************************************************************


} //**************************************************************************************
//endregion
//**************************************************************************************
//region Declaration of ASN.1 EndOfContent type class
//**************************************************************************************


exports.Constructed = Constructed;

class LocalEndOfContentValueBlock extends ValueBlock {
  //**********************************************************************************

  /**
   * Constructor for "LocalEndOfContentValueBlock" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters);
  } //**********************************************************************************
  //noinspection JSUnusedLocalSymbols,JSUnusedLocalSymbols

  /**
   * Base function for converting block from BER encoded array of bytes
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   * @param {!number} inputOffset Offset in ASN.1 BER encoded array where decoding should be started
   * @param {!number} inputLength Maximum length of array of bytes which can be using in this function
   * @returns {number}
   */


  fromBER(inputBuffer, inputOffset, inputLength) {
    //region There is no "value block" for EndOfContent type and we need to return the same offset
    return inputOffset; //endregion
  } //**********************************************************************************
  //noinspection JSUnusedLocalSymbols

  /**
   * Encoding of current ASN.1 block into ASN.1 encoded array (BER rules)
   * @param {boolean} [sizeOnly=false] Flag that we need only a size of encoding, not a real array of bytes
   * @returns {ArrayBuffer}
   */


  toBER(sizeOnly = false) {
    return new ArrayBuffer(0);
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "EndOfContentValueBlock";
  } //**********************************************************************************


} //**************************************************************************************


class EndOfContent extends BaseBlock {
  //**********************************************************************************
  constructor(paramaters = {}) {
    super(paramaters, LocalEndOfContentValueBlock);
    this.idBlock.tagClass = 1; // UNIVERSAL

    this.idBlock.tagNumber = 0; // EndOfContent
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "EndOfContent";
  } //**********************************************************************************


} //**************************************************************************************
//endregion
//**************************************************************************************
//region Declaration of ASN.1 Boolean type class
//**************************************************************************************


exports.EndOfContent = EndOfContent;

class LocalBooleanValueBlock extends ValueBlock {
  //**********************************************************************************

  /**
   * Constructor for "LocalBooleanValueBlock" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters);
    this.value = (0, _pvutils.getParametersValue)(parameters, "value", false);
    this.isHexOnly = (0, _pvutils.getParametersValue)(parameters, "isHexOnly", false);
    if ("valueHex" in parameters) this.valueHex = parameters.valueHex.slice(0);else {
      this.valueHex = new ArrayBuffer(1);

      if (this.value === true) {
        const view = new Uint8Array(this.valueHex);
        view[0] = 0xFF;
      }
    }
  } //**********************************************************************************

  /**
   * Base function for converting block from BER encoded array of bytes
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   * @param {!number} inputOffset Offset in ASN.1 BER encoded array where decoding should be started
   * @param {!number} inputLength Maximum length of array of bytes which can be using in this function
   * @returns {number} Offset after least decoded byte
   */


  fromBER(inputBuffer, inputOffset, inputLength) {
    //region Basic check for parameters
    //noinspection JSCheckFunctionSignatures
    if ((0, _pvutils.checkBufferParams)(this, inputBuffer, inputOffset, inputLength) === false) return -1; //endregion
    //region Getting Uint8Array from ArrayBuffer

    const intBuffer = new Uint8Array(inputBuffer, inputOffset, inputLength); //endregion

    if (inputLength > 1) this.warnings.push("Boolean value encoded in more then 1 octet");
    this.isHexOnly = true; //region Copy input buffer to internal array

    this.valueHex = new ArrayBuffer(intBuffer.length);
    const view = new Uint8Array(this.valueHex);

    for (let i = 0; i < intBuffer.length; i++) view[i] = intBuffer[i]; //endregion


    if (_pvutils.utilDecodeTC.call(this) !== 0) this.value = true;else this.value = false;
    this.blockLength = inputLength;
    return inputOffset + inputLength;
  } //**********************************************************************************
  //noinspection JSUnusedLocalSymbols

  /**
   * Encoding of current ASN.1 block into ASN.1 encoded array (BER rules)
   * @param {boolean} [sizeOnly=false] Flag that we need only a size of encoding, not a real array of bytes
   * @returns {ArrayBuffer}
   */


  toBER(sizeOnly = false) {
    return this.valueHex;
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "BooleanValueBlock";
  } //**********************************************************************************

  /**
   * Convertion for the block to JSON object
   * @returns {{blockName, blockLength, error, warnings, valueBeforeDecode}|{blockName: string, blockLength: number, error: string, warnings: Array.<string>, valueBeforeDecode: string}}
   */


  toJSON() {
    let object = {}; //region Seems at the moment (Sep 2016) there is no way how to check method is supported in "super" object

    try {
      object = super.toJSON();
    } catch (ex) {} //endregion


    object.value = this.value;
    object.isHexOnly = this.isHexOnly;
    object.valueHex = (0, _pvutils.bufferToHexCodes)(this.valueHex, 0, this.valueHex.byteLength);
    return object;
  } //**********************************************************************************


} //**************************************************************************************


class Boolean extends BaseBlock {
  //**********************************************************************************

  /**
   * Constructor for "Boolean" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters, LocalBooleanValueBlock);
    this.idBlock.tagClass = 1; // UNIVERSAL

    this.idBlock.tagNumber = 1; // Boolean
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "Boolean";
  } //**********************************************************************************


} //**************************************************************************************
//endregion
//**************************************************************************************
//region Declaration of ASN.1 Sequence and Set type classes
//**************************************************************************************


exports.Boolean = Boolean;

class Sequence extends Constructed {
  //**********************************************************************************

  /**
   * Constructor for "Sequence" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1; // UNIVERSAL

    this.idBlock.tagNumber = 16; // Sequence
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "Sequence";
  } //**********************************************************************************


} //**************************************************************************************


exports.Sequence = Sequence;

class Set extends Constructed {
  //**********************************************************************************

  /**
   * Constructor for "Set" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1; // UNIVERSAL

    this.idBlock.tagNumber = 17; // Set
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "Set";
  } //**********************************************************************************


} //**************************************************************************************
//endregion
//**************************************************************************************
//region Declaration of ASN.1 Null type class
//**************************************************************************************


exports.Set = Set;

class Null extends BaseBlock {
  //**********************************************************************************

  /**
   * Constructor for "Null" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters, LocalBaseBlock); // We will not have a call to "Null value block" because of specified "fromBER" and "toBER" functions

    this.idBlock.tagClass = 1; // UNIVERSAL

    this.idBlock.tagNumber = 5; // Null
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "Null";
  } //**********************************************************************************
  //noinspection JSUnusedLocalSymbols

  /**
   * Base function for converting block from BER encoded array of bytes
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   * @param {!number} inputOffset Offset in ASN.1 BER encoded array where decoding should be started
   * @param {!number} inputLength Maximum length of array of bytes which can be using in this function
   * @returns {number} Offset after least decoded byte
   */


  fromBER(inputBuffer, inputOffset, inputLength) {
    if (this.lenBlock.length > 0) this.warnings.push("Non-zero length of value block for Null type");
    if (this.idBlock.error.length === 0) this.blockLength += this.idBlock.blockLength;
    if (this.lenBlock.error.length === 0) this.blockLength += this.lenBlock.blockLength;
    this.blockLength += inputLength;

    if (inputOffset + inputLength > inputBuffer.byteLength) {
      this.error = "End of input reached before message was fully decoded (inconsistent offset and length values)";
      return -1;
    }

    return inputOffset + inputLength;
  } //**********************************************************************************

  /**
   * Encoding of current ASN.1 block into ASN.1 encoded array (BER rules)
   * @param {boolean} [sizeOnly=false] Flag that we need only a size of encoding, not a real array of bytes
   * @returns {ArrayBuffer}
   */


  toBER(sizeOnly = false) {
    const retBuf = new ArrayBuffer(2);
    if (sizeOnly === true) return retBuf;
    const retView = new Uint8Array(retBuf);
    retView[0] = 0x05;
    retView[1] = 0x00;
    return retBuf;
  } //**********************************************************************************


} //**************************************************************************************
//endregion
//**************************************************************************************
//region Declaration of ASN.1 OctetString type class
//**************************************************************************************


exports.Null = Null;

class LocalOctetStringValueBlock extends HexBlock(LocalConstructedValueBlock) {
  //**********************************************************************************

  /**
   * Constructor for "LocalOctetStringValueBlock" class
   * @param {Object} [parameters={}]
   * @property {ArrayBuffer} [valueHex]
   */
  constructor(parameters = {}) {
    super(parameters);
    this.isConstructed = (0, _pvutils.getParametersValue)(parameters, "isConstructed", false);
  } //**********************************************************************************

  /**
   * Base function for converting block from BER encoded array of bytes
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   * @param {!number} inputOffset Offset in ASN.1 BER encoded array where decoding should be started
   * @param {!number} inputLength Maximum length of array of bytes which can be using in this function
   * @returns {number} Offset after least decoded byte
   */


  fromBER(inputBuffer, inputOffset, inputLength) {
    let resultOffset = 0;

    if (this.isConstructed === true) {
      this.isHexOnly = false;
      resultOffset = LocalConstructedValueBlock.prototype.fromBER.call(this, inputBuffer, inputOffset, inputLength);
      if (resultOffset === -1) return resultOffset;

      for (let i = 0; i < this.value.length; i++) {
        const currentBlockName = this.value[i].constructor.blockName();

        if (currentBlockName === EndOfContent.blockName()) {
          if (this.isIndefiniteForm === true) break;else {
            this.error = "EndOfContent is unexpected, OCTET STRING may consists of OCTET STRINGs only";
            return -1;
          }
        }

        if (currentBlockName !== OctetString.blockName()) {
          this.error = "OCTET STRING may consists of OCTET STRINGs only";
          return -1;
        }
      }
    } else {
      this.isHexOnly = true;
      resultOffset = super.fromBER(inputBuffer, inputOffset, inputLength);
      this.blockLength = inputLength;
    }

    return resultOffset;
  } //**********************************************************************************

  /**
   * Encoding of current ASN.1 block into ASN.1 encoded array (BER rules)
   * @param {boolean} [sizeOnly=false] Flag that we need only a size of encoding, not a real array of bytes
   * @returns {ArrayBuffer}
   */


  toBER(sizeOnly = false) {
    if (this.isConstructed === true) return LocalConstructedValueBlock.prototype.toBER.call(this, sizeOnly);
    let retBuf = new ArrayBuffer(this.valueHex.byteLength);
    if (sizeOnly === true) return retBuf;
    if (this.valueHex.byteLength === 0) return retBuf;
    retBuf = this.valueHex.slice(0);
    return retBuf;
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "OctetStringValueBlock";
  } //**********************************************************************************


  toJSON() {
    let object = {}; //region Seems at the moment (Sep 2016) there is no way how to check method is supported in "super" object

    try {
      object = super.toJSON();
    } catch (ex) {} //endregion


    object.isConstructed = this.isConstructed;
    object.isHexOnly = this.isHexOnly;
    object.valueHex = (0, _pvutils.bufferToHexCodes)(this.valueHex, 0, this.valueHex.byteLength);
    return object;
  } //**********************************************************************************


} //**************************************************************************************


class OctetString extends BaseBlock {
  //**********************************************************************************

  /**
   * Constructor for "OctetString" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters, LocalOctetStringValueBlock);
    this.idBlock.tagClass = 1; // UNIVERSAL

    this.idBlock.tagNumber = 4; // OctetString
  } //**********************************************************************************

  /**
   * Base function for converting block from BER encoded array of bytes
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   * @param {!number} inputOffset Offset in ASN.1 BER encoded array where decoding should be started
   * @param {!number} inputLength Maximum length of array of bytes which can be using in this function
   * @returns {number} Offset after least decoded byte
   */


  fromBER(inputBuffer, inputOffset, inputLength) {
    this.valueBlock.isConstructed = this.idBlock.isConstructed;
    this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm; //region Ability to encode empty OCTET STRING

    if (inputLength === 0) {
      if (this.idBlock.error.length === 0) this.blockLength += this.idBlock.blockLength;
      if (this.lenBlock.error.length === 0) this.blockLength += this.lenBlock.blockLength;
      return inputOffset;
    } //endregion


    return super.fromBER(inputBuffer, inputOffset, inputLength);
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "OctetString";
  } //**********************************************************************************
  //noinspection JSUnusedGlobalSymbols

  /**
   * Checking that two OCTETSTRINGs are equal
   * @param {OctetString} octetString
   */


  isEqual(octetString) {
    //region Check input type
    if (octetString instanceof OctetString === false) return false; //endregion
    //region Compare two JSON strings

    if (JSON.stringify(this) !== JSON.stringify(octetString)) return false; //endregion

    return true;
  } //**********************************************************************************


} //**************************************************************************************
//endregion
//**************************************************************************************
//region Declaration of ASN.1 BitString type class
//**************************************************************************************


exports.OctetString = OctetString;

class LocalBitStringValueBlock extends HexBlock(LocalConstructedValueBlock) {
  //**********************************************************************************

  /**
   * Constructor for "LocalBitStringValueBlock" class
   * @param {Object} [parameters={}]
   * @property {ArrayBuffer} [valueHex]
   */
  constructor(parameters = {}) {
    super(parameters);
    this.unusedBits = (0, _pvutils.getParametersValue)(parameters, "unusedBits", 0);
    this.isConstructed = (0, _pvutils.getParametersValue)(parameters, "isConstructed", false);
    this.blockLength = this.valueHex.byteLength;
  } //**********************************************************************************

  /**
   * Base function for converting block from BER encoded array of bytes
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   * @param {!number} inputOffset Offset in ASN.1 BER encoded array where decoding should be started
   * @param {!number} inputLength Maximum length of array of bytes which can be using in this function
   * @returns {number} Offset after least decoded byte
   */


  fromBER(inputBuffer, inputOffset, inputLength) {
    //region Ability to decode zero-length BitString value
    if (inputLength === 0) return inputOffset; //endregion

    let resultOffset = -1; //region If the BISTRING supposed to be a constructed value

    if (this.isConstructed === true) {
      resultOffset = LocalConstructedValueBlock.prototype.fromBER.call(this, inputBuffer, inputOffset, inputLength);
      if (resultOffset === -1) return resultOffset;

      for (let i = 0; i < this.value.length; i++) {
        const currentBlockName = this.value[i].constructor.blockName();

        if (currentBlockName === EndOfContent.blockName()) {
          if (this.isIndefiniteForm === true) break;else {
            this.error = "EndOfContent is unexpected, BIT STRING may consists of BIT STRINGs only";
            return -1;
          }
        }

        if (currentBlockName !== BitString.blockName()) {
          this.error = "BIT STRING may consists of BIT STRINGs only";
          return -1;
        }

        if (this.unusedBits > 0 && this.value[i].valueBlock.unusedBits > 0) {
          this.error = "Usign of \"unused bits\" inside constructive BIT STRING allowed for least one only";
          return -1;
        }

        this.unusedBits = this.value[i].valueBlock.unusedBits;

        if (this.unusedBits > 7) {
          this.error = "Unused bits for BitString must be in range 0-7";
          return -1;
        }
      }

      return resultOffset;
    } //endregion
    //region If the BitString supposed to be a primitive value
    //region Basic check for parameters
    //noinspection JSCheckFunctionSignatures


    if ((0, _pvutils.checkBufferParams)(this, inputBuffer, inputOffset, inputLength) === false) return -1; //endregion

    const intBuffer = new Uint8Array(inputBuffer, inputOffset, inputLength);
    this.unusedBits = intBuffer[0];

    if (this.unusedBits > 7) {
      this.error = "Unused bits for BitString must be in range 0-7";
      return -1;
    } //region Copy input buffer to internal buffer


    this.valueHex = new ArrayBuffer(intBuffer.length - 1);
    const view = new Uint8Array(this.valueHex);

    for (let i = 0; i < inputLength - 1; i++) view[i] = intBuffer[i + 1]; //endregion


    this.blockLength = intBuffer.length;
    return inputOffset + inputLength; //endregion
  } //**********************************************************************************

  /**
   * Encoding of current ASN.1 block into ASN.1 encoded array (BER rules)
   * @param {boolean} [sizeOnly=false] Flag that we need only a size of encoding, not a real array of bytes
   * @returns {ArrayBuffer}
   */


  toBER(sizeOnly = false) {
    if (this.isConstructed === true) return LocalConstructedValueBlock.prototype.toBER.call(this, sizeOnly);
    if (sizeOnly === true) return new ArrayBuffer(this.valueHex.byteLength + 1);
    if (this.valueHex.byteLength === 0) return new ArrayBuffer(0);
    const curView = new Uint8Array(this.valueHex);
    const retBuf = new ArrayBuffer(this.valueHex.byteLength + 1);
    const retView = new Uint8Array(retBuf);
    retView[0] = this.unusedBits;

    for (let i = 0; i < this.valueHex.byteLength; i++) retView[i + 1] = curView[i];

    return retBuf;
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "BitStringValueBlock";
  } //**********************************************************************************

  /**
   * Convertion for the block to JSON object
   * @returns {{blockName, blockLength, error, warnings, valueBeforeDecode}|{blockName: string, blockLength: number, error: string, warnings: Array.<string>, valueBeforeDecode: string}}
   */


  toJSON() {
    let object = {}; //region Seems at the moment (Sep 2016) there is no way how to check method is supported in "super" object

    try {
      object = super.toJSON();
    } catch (ex) {} //endregion


    object.unusedBits = this.unusedBits;
    object.isConstructed = this.isConstructed;
    object.isHexOnly = this.isHexOnly;
    object.valueHex = (0, _pvutils.bufferToHexCodes)(this.valueHex, 0, this.valueHex.byteLength);
    return object;
  } //**********************************************************************************


} //**************************************************************************************


class BitString extends BaseBlock {
  //**********************************************************************************

  /**
   * Constructor for "BitString" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters, LocalBitStringValueBlock);
    this.idBlock.tagClass = 1; // UNIVERSAL

    this.idBlock.tagNumber = 3; // BitString
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "BitString";
  } //**********************************************************************************

  /**
   * Base function for converting block from BER encoded array of bytes
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   * @param {!number} inputOffset Offset in ASN.1 BER encoded array where decoding should be started
   * @param {!number} inputLength Maximum length of array of bytes which can be using in this function
   * @returns {number} Offset after least decoded byte
   */


  fromBER(inputBuffer, inputOffset, inputLength) {
    //region Ability to encode empty BitString
    if (inputLength === 0) return inputOffset; //endregion

    this.valueBlock.isConstructed = this.idBlock.isConstructed;
    this.valueBlock.isIndefiniteForm = this.lenBlock.isIndefiniteForm;
    return super.fromBER(inputBuffer, inputOffset, inputLength);
  } //**********************************************************************************

  /**
   * Checking that two BITSTRINGs are equal
   * @param {BitString} bitString
   */


  isEqual(bitString) {
    //region Check input type
    if (bitString instanceof BitString === false) return false; //endregion
    //region Compare two JSON strings

    if (JSON.stringify(this) !== JSON.stringify(bitString)) return false; //endregion

    return true;
  } //**********************************************************************************


} //**************************************************************************************
//endregion
//**************************************************************************************
//region Declaration of ASN.1 Integer type class
//**************************************************************************************

/**
 * @extends ValueBlock
 */


exports.BitString = BitString;

class LocalIntegerValueBlock extends HexBlock(ValueBlock) {
  //**********************************************************************************

  /**
   * Constructor for "LocalIntegerValueBlock" class
   * @param {Object} [parameters={}]
   * @property {ArrayBuffer} [valueHex]
   */
  constructor(parameters = {}) {
    super(parameters);
    if ("value" in parameters) this.valueDec = parameters.value;
  } //**********************************************************************************

  /**
   * Setter for "valueHex"
   * @param {ArrayBuffer} _value
   */


  set valueHex(_value) {
    this._valueHex = _value.slice(0);

    if (_value.byteLength >= 4) {
      this.warnings.push("Too big Integer for decoding, hex only");
      this.isHexOnly = true;
      this._valueDec = 0;
    } else {
      this.isHexOnly = false;
      if (_value.byteLength > 0) this._valueDec = _pvutils.utilDecodeTC.call(this);
    }
  } //**********************************************************************************

  /**
   * Getter for "valueHex"
   * @returns {ArrayBuffer}
   */


  get valueHex() {
    return this._valueHex;
  } //**********************************************************************************

  /**
   * Getter for "valueDec"
   * @param {number} _value
   */


  set valueDec(_value) {
    this._valueDec = _value;
    this.isHexOnly = false;
    this._valueHex = (0, _pvutils.utilEncodeTC)(_value);
  } //**********************************************************************************

  /**
   * Getter for "valueDec"
   * @returns {number}
   */


  get valueDec() {
    return this._valueDec;
  } //**********************************************************************************

  /**
   * Base function for converting block from DER encoded array of bytes
   * @param {!ArrayBuffer} inputBuffer ASN.1 DER encoded array
   * @param {!number} inputOffset Offset in ASN.1 DER encoded array where decoding should be started
   * @param {!number} inputLength Maximum length of array of bytes which can be using in this function
   * @param {number} [expectedLength=0] Expected length of converted "valueHex" buffer
   * @returns {number} Offset after least decoded byte
   */


  fromDER(inputBuffer, inputOffset, inputLength, expectedLength = 0) {
    const offset = this.fromBER(inputBuffer, inputOffset, inputLength);
    if (offset === -1) return offset;
    const view = new Uint8Array(this._valueHex);

    if (view[0] === 0x00 && (view[1] & 0x80) !== 0) {
      const updatedValueHex = new ArrayBuffer(this._valueHex.byteLength - 1);
      const updatedView = new Uint8Array(updatedValueHex);
      updatedView.set(new Uint8Array(this._valueHex, 1, this._valueHex.byteLength - 1));
      this._valueHex = updatedValueHex.slice(0);
    } else {
      if (expectedLength !== 0) {
        if (this._valueHex.byteLength < expectedLength) {
          if (expectedLength - this._valueHex.byteLength > 1) expectedLength = this._valueHex.byteLength + 1;
          const updatedValueHex = new ArrayBuffer(expectedLength);
          const updatedView = new Uint8Array(updatedValueHex);
          updatedView.set(view, expectedLength - this._valueHex.byteLength);
          this._valueHex = updatedValueHex.slice(0);
        }
      }
    }

    return offset;
  } //**********************************************************************************

  /**
   * Encoding of current ASN.1 block into ASN.1 encoded array (DER rules)
   * @param {boolean} [sizeOnly=false] Flag that we need only a size of encoding, not a real array of bytes
   * @returns {ArrayBuffer}
   */


  toDER(sizeOnly = false) {
    const view = new Uint8Array(this._valueHex);

    switch (true) {
      case (view[0] & 0x80) !== 0:
        {
          const updatedValueHex = new ArrayBuffer(this._valueHex.byteLength + 1);
          const updatedView = new Uint8Array(updatedValueHex);
          updatedView[0] = 0x00;
          updatedView.set(view, 1);
          this._valueHex = updatedValueHex.slice(0);
        }
        break;

      case view[0] === 0x00 && (view[1] & 0x80) === 0:
        {
          const updatedValueHex = new ArrayBuffer(this._valueHex.byteLength - 1);
          const updatedView = new Uint8Array(updatedValueHex);
          updatedView.set(new Uint8Array(this._valueHex, 1, this._valueHex.byteLength - 1));
          this._valueHex = updatedValueHex.slice(0);
        }
        break;

      default:
    }

    return this.toBER(sizeOnly);
  } //**********************************************************************************

  /**
   * Base function for converting block from BER encoded array of bytes
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   * @param {!number} inputOffset Offset in ASN.1 BER encoded array where decoding should be started
   * @param {!number} inputLength Maximum length of array of bytes which can be using in this function
   * @returns {number} Offset after least decoded byte
   */


  fromBER(inputBuffer, inputOffset, inputLength) {
    const resultOffset = super.fromBER(inputBuffer, inputOffset, inputLength);
    if (resultOffset === -1) return resultOffset;
    this.blockLength = inputLength;
    return inputOffset + inputLength;
  } //**********************************************************************************

  /**
   * Encoding of current ASN.1 block into ASN.1 encoded array (BER rules)
   * @param {boolean} [sizeOnly=false] Flag that we need only a size of encoding, not a real array of bytes
   * @returns {ArrayBuffer}
   */


  toBER(sizeOnly = false) {
    //noinspection JSCheckFunctionSignatures
    return this.valueHex.slice(0);
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "IntegerValueBlock";
  } //**********************************************************************************
  //noinspection JSUnusedGlobalSymbols

  /**
   * Convertion for the block to JSON object
   * @returns {Object}
   */


  toJSON() {
    let object = {}; //region Seems at the moment (Sep 2016) there is no way how to check method is supported in "super" object

    try {
      object = super.toJSON();
    } catch (ex) {} //endregion


    object.valueDec = this.valueDec;
    return object;
  } //**********************************************************************************

  /**
   * Convert current value to decimal string representation
   */


  toString() {
    //region Aux functions
    function viewAdd(first, second) {
      //region Initial variables
      const c = new Uint8Array([0]);
      let firstView = new Uint8Array(first);
      let secondView = new Uint8Array(second);
      let firstViewCopy = firstView.slice(0);
      const firstViewCopyLength = firstViewCopy.length - 1;
      let secondViewCopy = secondView.slice(0);
      const secondViewCopyLength = secondViewCopy.length - 1;
      let value = 0;
      const max = secondViewCopyLength < firstViewCopyLength ? firstViewCopyLength : secondViewCopyLength;
      let counter = 0; //endregion

      for (let i = max; i >= 0; i--, counter++) {
        switch (true) {
          case counter < secondViewCopy.length:
            value = firstViewCopy[firstViewCopyLength - counter] + secondViewCopy[secondViewCopyLength - counter] + c[0];
            break;

          default:
            value = firstViewCopy[firstViewCopyLength - counter] + c[0];
        }

        c[0] = value / 10;

        switch (true) {
          case counter >= firstViewCopy.length:
            firstViewCopy = (0, _pvutils.utilConcatView)(new Uint8Array([value % 10]), firstViewCopy);
            break;

          default:
            firstViewCopy[firstViewCopyLength - counter] = value % 10;
        }
      }

      if (c[0] > 0) firstViewCopy = (0, _pvutils.utilConcatView)(c, firstViewCopy);
      return firstViewCopy.slice(0);
    }

    function power2(n) {
      if (n >= powers2.length) {
        for (let p = powers2.length; p <= n; p++) {
          const c = new Uint8Array([0]);
          let digits = powers2[p - 1].slice(0);

          for (let i = digits.length - 1; i >= 0; i--) {
            const newValue = new Uint8Array([(digits[i] << 1) + c[0]]);
            c[0] = newValue[0] / 10;
            digits[i] = newValue[0] % 10;
          }

          if (c[0] > 0) digits = (0, _pvutils.utilConcatView)(c, digits);
          powers2.push(digits);
        }
      }

      return powers2[n];
    }

    function viewSub(first, second) {
      //region Initial variables
      let b = 0;
      let firstView = new Uint8Array(first);
      let secondView = new Uint8Array(second);
      let firstViewCopy = firstView.slice(0);
      const firstViewCopyLength = firstViewCopy.length - 1;
      let secondViewCopy = secondView.slice(0);
      const secondViewCopyLength = secondViewCopy.length - 1;
      let value;
      let counter = 0; //endregion

      for (let i = secondViewCopyLength; i >= 0; i--, counter++) {
        value = firstViewCopy[firstViewCopyLength - counter] - secondViewCopy[secondViewCopyLength - counter] - b;

        switch (true) {
          case value < 0:
            b = 1;
            firstViewCopy[firstViewCopyLength - counter] = value + 10;
            break;

          default:
            b = 0;
            firstViewCopy[firstViewCopyLength - counter] = value;
        }
      }

      if (b > 0) {
        for (let i = firstViewCopyLength - secondViewCopyLength + 1; i >= 0; i--, counter++) {
          value = firstViewCopy[firstViewCopyLength - counter] - b;

          if (value < 0) {
            b = 1;
            firstViewCopy[firstViewCopyLength - counter] = value + 10;
          } else {
            b = 0;
            firstViewCopy[firstViewCopyLength - counter] = value;
            break;
          }
        }
      }

      return firstViewCopy.slice();
    } //endregion
    //region Initial variables


    const firstBit = this._valueHex.byteLength * 8 - 1;
    let digits = new Uint8Array(this._valueHex.byteLength * 8 / 3);
    let bitNumber = 0;
    let currentByte;
    const asn1View = new Uint8Array(this._valueHex);
    let result = "";
    let flag = false; //endregion
    //region Calculate number

    for (let byteNumber = this._valueHex.byteLength - 1; byteNumber >= 0; byteNumber--) {
      currentByte = asn1View[byteNumber];

      for (let i = 0; i < 8; i++) {
        if ((currentByte & 1) === 1) {
          switch (bitNumber) {
            case firstBit:
              digits = viewSub(power2(bitNumber), digits);
              result = "-";
              break;

            default:
              digits = viewAdd(digits, power2(bitNumber));
          }
        }

        bitNumber++;
        currentByte >>= 1;
      }
    } //endregion
    //region Print number


    for (let i = 0; i < digits.length; i++) {
      if (digits[i]) flag = true;
      if (flag) result += digitsString.charAt(digits[i]);
    }

    if (flag === false) result += digitsString.charAt(0); //endregion

    return result;
  } //**********************************************************************************


} //**************************************************************************************


class Integer extends BaseBlock {
  //**********************************************************************************

  /**
   * Constructor for "Integer" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters, LocalIntegerValueBlock);
    this.idBlock.tagClass = 1; // UNIVERSAL

    this.idBlock.tagNumber = 2; // Integer
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "Integer";
  } //**********************************************************************************
  //noinspection JSUnusedGlobalSymbols

  /**
   * Compare two Integer object, or Integer and ArrayBuffer objects
   * @param {!Integer|ArrayBuffer} otherValue
   * @returns {boolean}
   */


  isEqual(otherValue) {
    if (otherValue instanceof Integer) {
      if (this.valueBlock.isHexOnly && otherValue.valueBlock.isHexOnly) // Compare two ArrayBuffers
        return (0, _pvutils.isEqualBuffer)(this.valueBlock.valueHex, otherValue.valueBlock.valueHex);
      if (this.valueBlock.isHexOnly === otherValue.valueBlock.isHexOnly) return this.valueBlock.valueDec === otherValue.valueBlock.valueDec;
      return false;
    }

    if (otherValue instanceof ArrayBuffer) return (0, _pvutils.isEqualBuffer)(this.valueBlock.valueHex, otherValue);
    return false;
  } //**********************************************************************************

  /**
   * Convert current Integer value from BER into DER format
   * @returns {Integer}
   */


  convertToDER() {
    const integer = new Integer({
      valueHex: this.valueBlock.valueHex
    });
    integer.valueBlock.toDER();
    return integer;
  } //**********************************************************************************

  /**
   * Convert current Integer value from DER to BER format
   * @returns {Integer}
   */


  convertFromDER() {
    const expectedLength = this.valueBlock.valueHex.byteLength % 2 ? this.valueBlock.valueHex.byteLength + 1 : this.valueBlock.valueHex.byteLength;
    const integer = new Integer({
      valueHex: this.valueBlock.valueHex
    });
    integer.valueBlock.fromDER(integer.valueBlock.valueHex, 0, integer.valueBlock.valueHex.byteLength, expectedLength);
    return integer;
  } //**********************************************************************************


} //**************************************************************************************
//endregion
//**************************************************************************************
//region Declaration of ASN.1 Enumerated type class
//**************************************************************************************


exports.Integer = Integer;

class Enumerated extends Integer {
  //**********************************************************************************

  /**
   * Constructor for "Enumerated" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1; // UNIVERSAL

    this.idBlock.tagNumber = 10; // Enumerated
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "Enumerated";
  } //**********************************************************************************


} //**************************************************************************************
//endregion
//**************************************************************************************
//region Declaration of ASN.1 ObjectIdentifier type class
//**************************************************************************************


exports.Enumerated = Enumerated;

class LocalSidValueBlock extends HexBlock(LocalBaseBlock) {
  //**********************************************************************************

  /**
   * Constructor for "LocalSidValueBlock" class
   * @param {Object} [parameters={}]
   * @property {number} [valueDec]
   * @property {boolean} [isFirstSid]
   */
  constructor(parameters = {}) {
    super(parameters);
    this.valueDec = (0, _pvutils.getParametersValue)(parameters, "valueDec", -1);
    this.isFirstSid = (0, _pvutils.getParametersValue)(parameters, "isFirstSid", false);
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "sidBlock";
  } //**********************************************************************************

  /**
   * Base function for converting block from BER encoded array of bytes
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   * @param {!number} inputOffset Offset in ASN.1 BER encoded array where decoding should be started
   * @param {!number} inputLength Maximum length of array of bytes which can be using in this function
   * @returns {number} Offset after least decoded byte
   */


  fromBER(inputBuffer, inputOffset, inputLength) {
    if (inputLength === 0) return inputOffset; //region Basic check for parameters
    //noinspection JSCheckFunctionSignatures

    if ((0, _pvutils.checkBufferParams)(this, inputBuffer, inputOffset, inputLength) === false) return -1; //endregion

    const intBuffer = new Uint8Array(inputBuffer, inputOffset, inputLength);
    this.valueHex = new ArrayBuffer(inputLength);
    let view = new Uint8Array(this.valueHex);

    for (let i = 0; i < inputLength; i++) {
      view[i] = intBuffer[i] & 0x7F;
      this.blockLength++;
      if ((intBuffer[i] & 0x80) === 0x00) break;
    } //region Ajust size of valueHex buffer


    const tempValueHex = new ArrayBuffer(this.blockLength);
    const tempView = new Uint8Array(tempValueHex);

    for (let i = 0; i < this.blockLength; i++) tempView[i] = view[i]; //noinspection JSCheckFunctionSignatures


    this.valueHex = tempValueHex.slice(0);
    view = new Uint8Array(this.valueHex); //endregion

    if ((intBuffer[this.blockLength - 1] & 0x80) !== 0x00) {
      this.error = "End of input reached before message was fully decoded";
      return -1;
    }

    if (view[0] === 0x00) this.warnings.push("Needlessly long format of SID encoding");
    if (this.blockLength <= 8) this.valueDec = (0, _pvutils.utilFromBase)(view, 7);else {
      this.isHexOnly = true;
      this.warnings.push("Too big SID for decoding, hex only");
    }
    return inputOffset + this.blockLength;
  } //**********************************************************************************

  /**
   * Encoding of current ASN.1 block into ASN.1 encoded array (BER rules)
   * @param {boolean} [sizeOnly=false] Flag that we need only a size of encoding, not a real array of bytes
   * @returns {ArrayBuffer}
   */


  toBER(sizeOnly = false) {
    //region Initial variables
    let retBuf;
    let retView; //endregion

    if (this.isHexOnly) {
      if (sizeOnly === true) return new ArrayBuffer(this.valueHex.byteLength);
      const curView = new Uint8Array(this.valueHex);
      retBuf = new ArrayBuffer(this.blockLength);
      retView = new Uint8Array(retBuf);

      for (let i = 0; i < this.blockLength - 1; i++) retView[i] = curView[i] | 0x80;

      retView[this.blockLength - 1] = curView[this.blockLength - 1];
      return retBuf;
    }

    const encodedBuf = (0, _pvutils.utilToBase)(this.valueDec, 7);

    if (encodedBuf.byteLength === 0) {
      this.error = "Error during encoding SID value";
      return new ArrayBuffer(0);
    }

    retBuf = new ArrayBuffer(encodedBuf.byteLength);

    if (sizeOnly === false) {
      const encodedView = new Uint8Array(encodedBuf);
      retView = new Uint8Array(retBuf);

      for (let i = 0; i < encodedBuf.byteLength - 1; i++) retView[i] = encodedView[i] | 0x80;

      retView[encodedBuf.byteLength - 1] = encodedView[encodedBuf.byteLength - 1];
    }

    return retBuf;
  } //**********************************************************************************

  /**
   * Create string representation of current SID block
   * @returns {string}
   */


  toString() {
    let result = "";
    if (this.isHexOnly === true) result = (0, _pvutils.bufferToHexCodes)(this.valueHex, 0, this.valueHex.byteLength);else {
      if (this.isFirstSid) {
        let sidValue = this.valueDec;
        if (this.valueDec <= 39) result = "0.";else {
          if (this.valueDec <= 79) {
            result = "1.";
            sidValue -= 40;
          } else {
            result = "2.";
            sidValue -= 80;
          }
        }
        result += sidValue.toString();
      } else result = this.valueDec.toString();
    }
    return result;
  } //**********************************************************************************
  //noinspection JSUnusedGlobalSymbols

  /**
   * Convertion for the block to JSON object
   * @returns {Object}
   */


  toJSON() {
    let object = {}; //region Seems at the moment (Sep 2016) there is no way how to check method is supported in "super" object

    try {
      object = super.toJSON();
    } catch (ex) {} //endregion


    object.valueDec = this.valueDec;
    object.isFirstSid = this.isFirstSid;
    return object;
  } //**********************************************************************************


} //**************************************************************************************


class LocalObjectIdentifierValueBlock extends ValueBlock {
  //**********************************************************************************

  /**
   * Constructor for "LocalObjectIdentifierValueBlock" class
   * @param {Object} [parameters={}]
   * @property {ArrayBuffer} [valueHex]
   */
  constructor(parameters = {}) {
    super(parameters);
    this.fromString((0, _pvutils.getParametersValue)(parameters, "value", ""));
  } //**********************************************************************************

  /**
   * Base function for converting block from BER encoded array of bytes
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   * @param {!number} inputOffset Offset in ASN.1 BER encoded array where decoding should be started
   * @param {!number} inputLength Maximum length of array of bytes which can be using in this function
   * @returns {number} Offset after least decoded byte
   */


  fromBER(inputBuffer, inputOffset, inputLength) {
    let resultOffset = inputOffset;

    while (inputLength > 0) {
      const sidBlock = new LocalSidValueBlock();
      resultOffset = sidBlock.fromBER(inputBuffer, resultOffset, inputLength);

      if (resultOffset === -1) {
        this.blockLength = 0;
        this.error = sidBlock.error;
        return resultOffset;
      }

      if (this.value.length === 0) sidBlock.isFirstSid = true;
      this.blockLength += sidBlock.blockLength;
      inputLength -= sidBlock.blockLength;
      this.value.push(sidBlock);
    }

    return resultOffset;
  } //**********************************************************************************

  /**
   * Encoding of current ASN.1 block into ASN.1 encoded array (BER rules)
   * @param {boolean} [sizeOnly=false] Flag that we need only a size of encoding, not a real array of bytes
   * @returns {ArrayBuffer}
   */


  toBER(sizeOnly = false) {
    let retBuf = new ArrayBuffer(0);

    for (let i = 0; i < this.value.length; i++) {
      const valueBuf = this.value[i].toBER(sizeOnly);

      if (valueBuf.byteLength === 0) {
        this.error = this.value[i].error;
        return new ArrayBuffer(0);
      }

      retBuf = (0, _pvutils.utilConcatBuf)(retBuf, valueBuf);
    }

    return retBuf;
  } //**********************************************************************************

  /**
   * Create "LocalObjectIdentifierValueBlock" class from string
   * @param {string} string Input string to convert from
   * @returns {boolean}
   */


  fromString(string) {
    this.value = []; // Clear existing SID values

    let pos1 = 0;
    let pos2 = 0;
    let sid = "";
    let flag = false;

    do {
      pos2 = string.indexOf(".", pos1);
      if (pos2 === -1) sid = string.substr(pos1);else sid = string.substr(pos1, pos2 - pos1);
      pos1 = pos2 + 1;

      if (flag) {
        const sidBlock = this.value[0];
        let plus = 0;

        switch (sidBlock.valueDec) {
          case 0:
            break;

          case 1:
            plus = 40;
            break;

          case 2:
            plus = 80;
            break;

          default:
            this.value = []; // clear SID array

            return false;
          // ???
        }

        const parsedSID = parseInt(sid, 10);
        if (isNaN(parsedSID)) return true;
        sidBlock.valueDec = parsedSID + plus;
        flag = false;
      } else {
        const sidBlock = new LocalSidValueBlock();
        sidBlock.valueDec = parseInt(sid, 10);
        if (isNaN(sidBlock.valueDec)) return true;

        if (this.value.length === 0) {
          sidBlock.isFirstSid = true;
          flag = true;
        }

        this.value.push(sidBlock);
      }
    } while (pos2 !== -1);

    return true;
  } //**********************************************************************************

  /**
   * Converts "LocalObjectIdentifierValueBlock" class to string
   * @returns {string}
   */


  toString() {
    let result = "";
    let isHexOnly = false;

    for (let i = 0; i < this.value.length; i++) {
      isHexOnly = this.value[i].isHexOnly;
      let sidStr = this.value[i].toString();
      if (i !== 0) result = `${result}.`;

      if (isHexOnly) {
        sidStr = `{${sidStr}}`;
        if (this.value[i].isFirstSid) result = `2.{${sidStr} - 80}`;else result += sidStr;
      } else result += sidStr;
    }

    return result;
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "ObjectIdentifierValueBlock";
  } //**********************************************************************************

  /**
   * Convertion for the block to JSON object
   * @returns {Object}
   */


  toJSON() {
    let object = {}; //region Seems at the moment (Sep 2016) there is no way how to check method is supported in "super" object

    try {
      object = super.toJSON();
    } catch (ex) {} //endregion


    object.value = this.toString();
    object.sidArray = [];

    for (let i = 0; i < this.value.length; i++) object.sidArray.push(this.value[i].toJSON());

    return object;
  } //**********************************************************************************


} //**************************************************************************************

/**
 * @extends BaseBlock
 */


class ObjectIdentifier extends BaseBlock {
  //**********************************************************************************

  /**
   * Constructor for "ObjectIdentifier" class
   * @param {Object} [parameters={}]
   * @property {ArrayBuffer} [valueHex]
   */
  constructor(parameters = {}) {
    super(parameters, LocalObjectIdentifierValueBlock);
    this.idBlock.tagClass = 1; // UNIVERSAL

    this.idBlock.tagNumber = 6; // OBJECT IDENTIFIER
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "ObjectIdentifier";
  } //**********************************************************************************


} //**************************************************************************************
//endregion
//**************************************************************************************
//region Declaration of all string's classes
//**************************************************************************************


exports.ObjectIdentifier = ObjectIdentifier;

class LocalUtf8StringValueBlock extends HexBlock(LocalBaseBlock) {
  //**********************************************************************************
  //noinspection JSUnusedGlobalSymbols

  /**
   * Constructor for "LocalUtf8StringValueBlock" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters);
    this.isHexOnly = true;
    this.value = ""; // String representation of decoded ArrayBuffer
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "Utf8StringValueBlock";
  } //**********************************************************************************
  //noinspection JSUnusedGlobalSymbols

  /**
   * Convertion for the block to JSON object
   * @returns {Object}
   */


  toJSON() {
    let object = {}; //region Seems at the moment (Sep 2016) there is no way how to check method is supported in "super" object

    try {
      object = super.toJSON();
    } catch (ex) {} //endregion


    object.value = this.value;
    return object;
  } //**********************************************************************************


} //**************************************************************************************

/**
 * @extends BaseBlock
 */


class Utf8String extends BaseBlock {
  //**********************************************************************************

  /**
   * Constructor for "Utf8String" class
   * @param {Object} [parameters={}]
   * @property {ArrayBuffer} [valueHex]
   */
  constructor(parameters = {}) {
    super(parameters, LocalUtf8StringValueBlock);
    if ("value" in parameters) this.fromString(parameters.value);
    this.idBlock.tagClass = 1; // UNIVERSAL

    this.idBlock.tagNumber = 12; // Utf8String
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "Utf8String";
  } //**********************************************************************************

  /**
   * Base function for converting block from BER encoded array of bytes
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   * @param {!number} inputOffset Offset in ASN.1 BER encoded array where decoding should be started
   * @param {!number} inputLength Maximum length of array of bytes which can be using in this function
   * @returns {number} Offset after least decoded byte
   */


  fromBER(inputBuffer, inputOffset, inputLength) {
    const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm === true ? inputLength : this.lenBlock.length);

    if (resultOffset === -1) {
      this.error = this.valueBlock.error;
      return resultOffset;
    }

    this.fromBuffer(this.valueBlock.valueHex);
    if (this.idBlock.error.length === 0) this.blockLength += this.idBlock.blockLength;
    if (this.lenBlock.error.length === 0) this.blockLength += this.lenBlock.blockLength;
    if (this.valueBlock.error.length === 0) this.blockLength += this.valueBlock.blockLength;
    return resultOffset;
  } //**********************************************************************************

  /**
   * Function converting ArrayBuffer into ASN.1 internal string
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   */


  fromBuffer(inputBuffer) {
    this.valueBlock.value = String.fromCharCode.apply(null, new Uint8Array(inputBuffer));

    try {
      //noinspection JSDeprecatedSymbols
      this.valueBlock.value = decodeURIComponent(escape(this.valueBlock.value));
    } catch (ex) {
      this.warnings.push(`Error during "decodeURIComponent": ${ex}, using raw string`);
    }
  } //**********************************************************************************

  /**
   * Function converting JavaScript string into ASN.1 internal class
   * @param {!string} inputString ASN.1 BER encoded array
   */


  fromString(inputString) {
    //noinspection JSDeprecatedSymbols
    const str = unescape(encodeURIComponent(inputString));
    const strLen = str.length;
    this.valueBlock.valueHex = new ArrayBuffer(strLen);
    const view = new Uint8Array(this.valueBlock.valueHex);

    for (let i = 0; i < strLen; i++) view[i] = str.charCodeAt(i);

    this.valueBlock.value = inputString;
  } //**********************************************************************************


} //**************************************************************************************
//region Declaration of ASN.1 RelativeObjectIdentifier type class
//**************************************************************************************


exports.Utf8String = Utf8String;

class LocalRelativeSidValueBlock extends HexBlock(LocalBaseBlock) {
  //**********************************************************************************

  /**
   * Constructor for "LocalRelativeSidValueBlock" class
   * @param {Object} [parameters={}]
   * @property {number} [valueDec]
   */
  constructor(parameters = {}) {
    super(parameters);
    this.valueDec = (0, _pvutils.getParametersValue)(parameters, "valueDec", -1);
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "relativeSidBlock";
  } //**********************************************************************************

  /**
   * Base function for converting block from BER encoded array of bytes
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   * @param {!number} inputOffset Offset in ASN.1 BER encoded array where decoding should be started
   * @param {!number} inputLength Maximum length of array of bytes which can be using in this function
   * @returns {number} Offset after least decoded byte
   */


  fromBER(inputBuffer, inputOffset, inputLength) {
    if (inputLength === 0) return inputOffset; //region Basic check for parameters
    //noinspection JSCheckFunctionSignatures

    if ((0, _pvutils.checkBufferParams)(this, inputBuffer, inputOffset, inputLength) === false) return -1; //endregion

    const intBuffer = new Uint8Array(inputBuffer, inputOffset, inputLength);
    this.valueHex = new ArrayBuffer(inputLength);
    let view = new Uint8Array(this.valueHex);

    for (let i = 0; i < inputLength; i++) {
      view[i] = intBuffer[i] & 0x7F;
      this.blockLength++;
      if ((intBuffer[i] & 0x80) === 0x00) break;
    } //region Ajust size of valueHex buffer


    const tempValueHex = new ArrayBuffer(this.blockLength);
    const tempView = new Uint8Array(tempValueHex);

    for (let i = 0; i < this.blockLength; i++) tempView[i] = view[i]; //noinspection JSCheckFunctionSignatures


    this.valueHex = tempValueHex.slice(0);
    view = new Uint8Array(this.valueHex); //endregion

    if ((intBuffer[this.blockLength - 1] & 0x80) !== 0x00) {
      this.error = "End of input reached before message was fully decoded";
      return -1;
    }

    if (view[0] === 0x00) this.warnings.push("Needlessly long format of SID encoding");
    if (this.blockLength <= 8) this.valueDec = (0, _pvutils.utilFromBase)(view, 7);else {
      this.isHexOnly = true;
      this.warnings.push("Too big SID for decoding, hex only");
    }
    return inputOffset + this.blockLength;
  } //**********************************************************************************

  /**
   * Encoding of current ASN.1 block into ASN.1 encoded array (BER rules)
   * @param {boolean} [sizeOnly=false] Flag that we need only a size of encoding, not a real array of bytes
   * @returns {ArrayBuffer}
   */


  toBER(sizeOnly = false) {
    //region Initial variables
    let retBuf;
    let retView; //endregion

    if (this.isHexOnly) {
      if (sizeOnly === true) return new ArrayBuffer(this.valueHex.byteLength);
      const curView = new Uint8Array(this.valueHex);
      retBuf = new ArrayBuffer(this.blockLength);
      retView = new Uint8Array(retBuf);

      for (let i = 0; i < this.blockLength - 1; i++) retView[i] = curView[i] | 0x80;

      retView[this.blockLength - 1] = curView[this.blockLength - 1];
      return retBuf;
    }

    const encodedBuf = (0, _pvutils.utilToBase)(this.valueDec, 7);

    if (encodedBuf.byteLength === 0) {
      this.error = "Error during encoding SID value";
      return new ArrayBuffer(0);
    }

    retBuf = new ArrayBuffer(encodedBuf.byteLength);

    if (sizeOnly === false) {
      const encodedView = new Uint8Array(encodedBuf);
      retView = new Uint8Array(retBuf);

      for (let i = 0; i < encodedBuf.byteLength - 1; i++) retView[i] = encodedView[i] | 0x80;

      retView[encodedBuf.byteLength - 1] = encodedView[encodedBuf.byteLength - 1];
    }

    return retBuf;
  } //**********************************************************************************

  /**
   * Create string representation of current SID block
   * @returns {string}
   */


  toString() {
    let result = "";
    if (this.isHexOnly === true) result = (0, _pvutils.bufferToHexCodes)(this.valueHex, 0, this.valueHex.byteLength);else {
      result = this.valueDec.toString();
    }
    return result;
  } //**********************************************************************************
  //noinspection JSUnusedGlobalSymbols

  /**
   * Convertion for the block to JSON object
   * @returns {Object}
   */


  toJSON() {
    let object = {}; //region Seems at the moment (Sep 2016) there is no way how to check method is supported in "super" object

    try {
      object = super.toJSON();
    } catch (ex) {} //endregion


    object.valueDec = this.valueDec;
    return object;
  } //**********************************************************************************


} //**************************************************************************************


class LocalRelativeObjectIdentifierValueBlock extends ValueBlock {
  //**********************************************************************************

  /**
   * Constructor for "LocalRelativeObjectIdentifierValueBlock" class
   * @param {Object} [parameters={}]
   * @property {ArrayBuffer} [valueHex]
   */
  constructor(parameters = {}) {
    super(parameters);
    this.fromString((0, _pvutils.getParametersValue)(parameters, "value", ""));
  } //**********************************************************************************

  /**
   * Base function for converting block from BER encoded array of bytes
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   * @param {!number} inputOffset Offset in ASN.1 BER encoded array where decoding should be started
   * @param {!number} inputLength Maximum length of array of bytes which can be using in this function
   * @returns {number} Offset after least decoded byte
   */


  fromBER(inputBuffer, inputOffset, inputLength) {
    let resultOffset = inputOffset;

    while (inputLength > 0) {
      const sidBlock = new LocalRelativeSidValueBlock();
      resultOffset = sidBlock.fromBER(inputBuffer, resultOffset, inputLength);

      if (resultOffset === -1) {
        this.blockLength = 0;
        this.error = sidBlock.error;
        return resultOffset;
      }

      this.blockLength += sidBlock.blockLength;
      inputLength -= sidBlock.blockLength;
      this.value.push(sidBlock);
    }

    return resultOffset;
  } //**********************************************************************************

  /**
   * Encoding of current ASN.1 block into ASN.1 encoded array (BER rules)
   * @param {boolean} [sizeOnly=false] Flag that we need only a size of encoding, not a real array of bytes
   * @returns {ArrayBuffer}
   */


  toBER(sizeOnly = false) {
    let retBuf = new ArrayBuffer(0);

    for (let i = 0; i < this.value.length; i++) {
      const valueBuf = this.value[i].toBER(sizeOnly);

      if (valueBuf.byteLength === 0) {
        this.error = this.value[i].error;
        return new ArrayBuffer(0);
      }

      retBuf = (0, _pvutils.utilConcatBuf)(retBuf, valueBuf);
    }

    return retBuf;
  } //**********************************************************************************

  /**
   * Create "LocalRelativeObjectIdentifierValueBlock" class from string
   * @param {string} string Input string to convert from
   * @returns {boolean}
   */


  fromString(string) {
    this.value = []; // Clear existing SID values

    let pos1 = 0;
    let pos2 = 0;
    let sid = "";

    do {
      pos2 = string.indexOf(".", pos1);
      if (pos2 === -1) sid = string.substr(pos1);else sid = string.substr(pos1, pos2 - pos1);
      pos1 = pos2 + 1;
      const sidBlock = new LocalRelativeSidValueBlock();
      sidBlock.valueDec = parseInt(sid, 10);
      if (isNaN(sidBlock.valueDec)) return true;
      this.value.push(sidBlock);
    } while (pos2 !== -1);

    return true;
  } //**********************************************************************************

  /**
   * Converts "LocalRelativeObjectIdentifierValueBlock" class to string
   * @returns {string}
   */


  toString() {
    let result = "";
    let isHexOnly = false;

    for (let i = 0; i < this.value.length; i++) {
      isHexOnly = this.value[i].isHexOnly;
      let sidStr = this.value[i].toString();
      if (i !== 0) result = `${result}.`;

      if (isHexOnly) {
        sidStr = `{${sidStr}}`;
        result += sidStr;
      } else result += sidStr;
    }

    return result;
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "RelativeObjectIdentifierValueBlock";
  } //**********************************************************************************

  /**
   * Convertion for the block to JSON object
   * @returns {Object}
   */


  toJSON() {
    let object = {}; //region Seems at the moment (Sep 2016) there is no way how to check method is supported in "super" object

    try {
      object = super.toJSON();
    } catch (ex) {} //endregion


    object.value = this.toString();
    object.sidArray = [];

    for (let i = 0; i < this.value.length; i++) object.sidArray.push(this.value[i].toJSON());

    return object;
  } //**********************************************************************************


} //**************************************************************************************

/**
 * @extends BaseBlock
 */


class RelativeObjectIdentifier extends BaseBlock {
  //**********************************************************************************

  /**
   * Constructor for "RelativeObjectIdentifier" class
   * @param {Object} [parameters={}]
   * @property {ArrayBuffer} [valueHex]
   */
  constructor(parameters = {}) {
    super(parameters, LocalRelativeObjectIdentifierValueBlock);
    this.idBlock.tagClass = 1; // UNIVERSAL

    this.idBlock.tagNumber = 13; // RELATIVE OBJECT IDENTIFIER
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "RelativeObjectIdentifier";
  } //**********************************************************************************


} //**************************************************************************************
//endregion
//**************************************************************************************

/**
 * @extends LocalBaseBlock
 * @extends HexBlock
 */


exports.RelativeObjectIdentifier = RelativeObjectIdentifier;

class LocalBmpStringValueBlock extends HexBlock(LocalBaseBlock) {
  //**********************************************************************************

  /**
   * Constructor for "LocalBmpStringValueBlock" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters);
    this.isHexOnly = true;
    this.value = "";
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "BmpStringValueBlock";
  } //**********************************************************************************
  //noinspection JSUnusedGlobalSymbols

  /**
   * Convertion for the block to JSON object
   * @returns {Object}
   */


  toJSON() {
    let object = {}; //region Seems at the moment (Sep 2016) there is no way how to check method is supported in "super" object

    try {
      object = super.toJSON();
    } catch (ex) {} //endregion


    object.value = this.value;
    return object;
  } //**********************************************************************************


} //**************************************************************************************

/**
 * @extends BaseBlock
 */


class BmpString extends BaseBlock {
  //**********************************************************************************

  /**
   * Constructor for "BmpString" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters, LocalBmpStringValueBlock);
    if ("value" in parameters) this.fromString(parameters.value);
    this.idBlock.tagClass = 1; // UNIVERSAL

    this.idBlock.tagNumber = 30; // BmpString
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "BmpString";
  } //**********************************************************************************

  /**
   * Base function for converting block from BER encoded array of bytes
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   * @param {!number} inputOffset Offset in ASN.1 BER encoded array where decoding should be started
   * @param {!number} inputLength Maximum length of array of bytes which can be using in this function
   * @returns {number} Offset after least decoded byte
   */


  fromBER(inputBuffer, inputOffset, inputLength) {
    const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm === true ? inputLength : this.lenBlock.length);

    if (resultOffset === -1) {
      this.error = this.valueBlock.error;
      return resultOffset;
    }

    this.fromBuffer(this.valueBlock.valueHex);
    if (this.idBlock.error.length === 0) this.blockLength += this.idBlock.blockLength;
    if (this.lenBlock.error.length === 0) this.blockLength += this.lenBlock.blockLength;
    if (this.valueBlock.error.length === 0) this.blockLength += this.valueBlock.blockLength;
    return resultOffset;
  } //**********************************************************************************

  /**
   * Function converting ArrayBuffer into ASN.1 internal string
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   */


  fromBuffer(inputBuffer) {
    //noinspection JSCheckFunctionSignatures
    const copyBuffer = inputBuffer.slice(0);
    const valueView = new Uint8Array(copyBuffer);

    for (let i = 0; i < valueView.length; i += 2) {
      const temp = valueView[i];
      valueView[i] = valueView[i + 1];
      valueView[i + 1] = temp;
    }

    this.valueBlock.value = String.fromCharCode.apply(null, new Uint16Array(copyBuffer));
  } //**********************************************************************************

  /**
   * Function converting JavaScript string into ASN.1 internal class
   * @param {!string} inputString ASN.1 BER encoded array
   */


  fromString(inputString) {
    const strLength = inputString.length;
    this.valueBlock.valueHex = new ArrayBuffer(strLength * 2);
    const valueHexView = new Uint8Array(this.valueBlock.valueHex);

    for (let i = 0; i < strLength; i++) {
      const codeBuf = (0, _pvutils.utilToBase)(inputString.charCodeAt(i), 8);
      const codeView = new Uint8Array(codeBuf);
      if (codeView.length > 2) continue;
      const dif = 2 - codeView.length;

      for (let j = codeView.length - 1; j >= 0; j--) valueHexView[i * 2 + j + dif] = codeView[j];
    }

    this.valueBlock.value = inputString;
  } //**********************************************************************************


} //**************************************************************************************


exports.BmpString = BmpString;

class LocalUniversalStringValueBlock extends HexBlock(LocalBaseBlock) {
  //**********************************************************************************

  /**
   * Constructor for "LocalUniversalStringValueBlock" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters);
    this.isHexOnly = true;
    this.value = "";
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "UniversalStringValueBlock";
  } //**********************************************************************************
  //noinspection JSUnusedGlobalSymbols

  /**
   * Convertion for the block to JSON object
   * @returns {Object}
   */


  toJSON() {
    let object = {}; //region Seems at the moment (Sep 2016) there is no way how to check method is supported in "super" object

    try {
      object = super.toJSON();
    } catch (ex) {} //endregion


    object.value = this.value;
    return object;
  } //**********************************************************************************


} //**************************************************************************************

/**
 * @extends BaseBlock
 */


class UniversalString extends BaseBlock {
  //**********************************************************************************

  /**
   * Constructor for "UniversalString" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters, LocalUniversalStringValueBlock);
    if ("value" in parameters) this.fromString(parameters.value);
    this.idBlock.tagClass = 1; // UNIVERSAL

    this.idBlock.tagNumber = 28; // UniversalString
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "UniversalString";
  } //**********************************************************************************

  /**
   * Base function for converting block from BER encoded array of bytes
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   * @param {!number} inputOffset Offset in ASN.1 BER encoded array where decoding should be started
   * @param {!number} inputLength Maximum length of array of bytes which can be using in this function
   * @returns {number} Offset after least decoded byte
   */


  fromBER(inputBuffer, inputOffset, inputLength) {
    const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm === true ? inputLength : this.lenBlock.length);

    if (resultOffset === -1) {
      this.error = this.valueBlock.error;
      return resultOffset;
    }

    this.fromBuffer(this.valueBlock.valueHex);
    if (this.idBlock.error.length === 0) this.blockLength += this.idBlock.blockLength;
    if (this.lenBlock.error.length === 0) this.blockLength += this.lenBlock.blockLength;
    if (this.valueBlock.error.length === 0) this.blockLength += this.valueBlock.blockLength;
    return resultOffset;
  } //**********************************************************************************

  /**
   * Function converting ArrayBuffer into ASN.1 internal string
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   */


  fromBuffer(inputBuffer) {
    //noinspection JSCheckFunctionSignatures
    const copyBuffer = inputBuffer.slice(0);
    const valueView = new Uint8Array(copyBuffer);

    for (let i = 0; i < valueView.length; i += 4) {
      valueView[i] = valueView[i + 3];
      valueView[i + 1] = valueView[i + 2];
      valueView[i + 2] = 0x00;
      valueView[i + 3] = 0x00;
    }

    this.valueBlock.value = String.fromCharCode.apply(null, new Uint32Array(copyBuffer));
  } //**********************************************************************************

  /**
   * Function converting JavaScript string into ASN.1 internal class
   * @param {!string} inputString ASN.1 BER encoded array
   */


  fromString(inputString) {
    const strLength = inputString.length;
    this.valueBlock.valueHex = new ArrayBuffer(strLength * 4);
    const valueHexView = new Uint8Array(this.valueBlock.valueHex);

    for (let i = 0; i < strLength; i++) {
      const codeBuf = (0, _pvutils.utilToBase)(inputString.charCodeAt(i), 8);
      const codeView = new Uint8Array(codeBuf);
      if (codeView.length > 4) continue;
      const dif = 4 - codeView.length;

      for (let j = codeView.length - 1; j >= 0; j--) valueHexView[i * 4 + j + dif] = codeView[j];
    }

    this.valueBlock.value = inputString;
  } //**********************************************************************************


} //**************************************************************************************


exports.UniversalString = UniversalString;

class LocalSimpleStringValueBlock extends HexBlock(LocalBaseBlock) {
  //**********************************************************************************

  /**
   * Constructor for "LocalSimpleStringValueBlock" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters);
    this.value = "";
    this.isHexOnly = true;
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "SimpleStringValueBlock";
  } //**********************************************************************************
  //noinspection JSUnusedGlobalSymbols

  /**
   * Convertion for the block to JSON object
   * @returns {Object}
   */


  toJSON() {
    let object = {}; //region Seems at the moment (Sep 2016) there is no way how to check method is supported in "super" object

    try {
      object = super.toJSON();
    } catch (ex) {} //endregion


    object.value = this.value;
    return object;
  } //**********************************************************************************


} //**************************************************************************************

/**
 * @extends BaseBlock
 */


class LocalSimpleStringBlock extends BaseBlock {
  //**********************************************************************************

  /**
   * Constructor for "LocalSimpleStringBlock" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters, LocalSimpleStringValueBlock);
    if ("value" in parameters) this.fromString(parameters.value);
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "SIMPLESTRING";
  } //**********************************************************************************

  /**
   * Base function for converting block from BER encoded array of bytes
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   * @param {!number} inputOffset Offset in ASN.1 BER encoded array where decoding should be started
   * @param {!number} inputLength Maximum length of array of bytes which can be using in this function
   * @returns {number} Offset after least decoded byte
   */


  fromBER(inputBuffer, inputOffset, inputLength) {
    const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm === true ? inputLength : this.lenBlock.length);

    if (resultOffset === -1) {
      this.error = this.valueBlock.error;
      return resultOffset;
    }

    this.fromBuffer(this.valueBlock.valueHex);
    if (this.idBlock.error.length === 0) this.blockLength += this.idBlock.blockLength;
    if (this.lenBlock.error.length === 0) this.blockLength += this.lenBlock.blockLength;
    if (this.valueBlock.error.length === 0) this.blockLength += this.valueBlock.blockLength;
    return resultOffset;
  } //**********************************************************************************

  /**
   * Function converting ArrayBuffer into ASN.1 internal string
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   */


  fromBuffer(inputBuffer) {
    this.valueBlock.value = String.fromCharCode.apply(null, new Uint8Array(inputBuffer));
  } //**********************************************************************************

  /**
   * Function converting JavaScript string into ASN.1 internal class
   * @param {!string} inputString ASN.1 BER encoded array
   */


  fromString(inputString) {
    const strLen = inputString.length;
    this.valueBlock.valueHex = new ArrayBuffer(strLen);
    const view = new Uint8Array(this.valueBlock.valueHex);

    for (let i = 0; i < strLen; i++) view[i] = inputString.charCodeAt(i);

    this.valueBlock.value = inputString;
  } //**********************************************************************************


} //**************************************************************************************

/**
 * @extends LocalSimpleStringBlock
 */


class NumericString extends LocalSimpleStringBlock {
  //**********************************************************************************

  /**
   * Constructor for "NumericString" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1; // UNIVERSAL

    this.idBlock.tagNumber = 18; // NumericString
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "NumericString";
  } //**********************************************************************************


} //**************************************************************************************

/**
 * @extends LocalSimpleStringBlock
 */


exports.NumericString = NumericString;

class PrintableString extends LocalSimpleStringBlock {
  //**********************************************************************************

  /**
   * Constructor for "PrintableString" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1; // UNIVERSAL

    this.idBlock.tagNumber = 19; // PrintableString
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "PrintableString";
  } //**********************************************************************************


} //**************************************************************************************

/**
 * @extends LocalSimpleStringBlock
 */


exports.PrintableString = PrintableString;

class TeletexString extends LocalSimpleStringBlock {
  //**********************************************************************************

  /**
   * Constructor for "TeletexString" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1; // UNIVERSAL

    this.idBlock.tagNumber = 20; // TeletexString
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "TeletexString";
  } //**********************************************************************************


} //**************************************************************************************

/**
 * @extends LocalSimpleStringBlock
 */


exports.TeletexString = TeletexString;

class VideotexString extends LocalSimpleStringBlock {
  //**********************************************************************************

  /**
   * Constructor for "VideotexString" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1; // UNIVERSAL

    this.idBlock.tagNumber = 21; // VideotexString
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "VideotexString";
  } //**********************************************************************************


} //**************************************************************************************

/**
 * @extends LocalSimpleStringBlock
 */


exports.VideotexString = VideotexString;

class IA5String extends LocalSimpleStringBlock {
  //**********************************************************************************

  /**
   * Constructor for "IA5String" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1; // UNIVERSAL

    this.idBlock.tagNumber = 22; // IA5String
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "IA5String";
  } //**********************************************************************************


} //**************************************************************************************

/**
 * @extends LocalSimpleStringBlock
 */


exports.IA5String = IA5String;

class GraphicString extends LocalSimpleStringBlock {
  //**********************************************************************************

  /**
   * Constructor for "GraphicString" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1; // UNIVERSAL

    this.idBlock.tagNumber = 25; // GraphicString
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "GraphicString";
  } //**********************************************************************************


} //**************************************************************************************

/**
 * @extends LocalSimpleStringBlock
 */


exports.GraphicString = GraphicString;

class VisibleString extends LocalSimpleStringBlock {
  //**********************************************************************************

  /**
   * Constructor for "VisibleString" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1; // UNIVERSAL

    this.idBlock.tagNumber = 26; // VisibleString
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "VisibleString";
  } //**********************************************************************************


} //**************************************************************************************

/**
 * @extends LocalSimpleStringBlock
 */


exports.VisibleString = VisibleString;

class GeneralString extends LocalSimpleStringBlock {
  //**********************************************************************************

  /**
   * Constructor for "GeneralString" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1; // UNIVERSAL

    this.idBlock.tagNumber = 27; // GeneralString
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "GeneralString";
  } //**********************************************************************************


} //**************************************************************************************

/**
 * @extends LocalSimpleStringBlock
 */


exports.GeneralString = GeneralString;

class CharacterString extends LocalSimpleStringBlock {
  //**********************************************************************************

  /**
   * Constructor for "CharacterString" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1; // UNIVERSAL

    this.idBlock.tagNumber = 29; // CharacterString
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "CharacterString";
  } //**********************************************************************************


} //**************************************************************************************
//endregion
//**************************************************************************************
//region Declaration of all date and time classes
//**************************************************************************************

/**
 * @extends VisibleString
 */


exports.CharacterString = CharacterString;

class UTCTime extends VisibleString {
  //**********************************************************************************

  /**
   * Constructor for "UTCTime" class
   * @param {Object} [parameters={}]
   * @property {string} [value] String representatio of the date
   * @property {Date} [valueDate] JavaScript "Date" object
   */
  constructor(parameters = {}) {
    super(parameters);
    this.year = 0;
    this.month = 0;
    this.day = 0;
    this.hour = 0;
    this.minute = 0;
    this.second = 0; //region Create UTCTime from ASN.1 UTC string value

    if ("value" in parameters) {
      this.fromString(parameters.value);
      this.valueBlock.valueHex = new ArrayBuffer(parameters.value.length);
      const view = new Uint8Array(this.valueBlock.valueHex);

      for (let i = 0; i < parameters.value.length; i++) view[i] = parameters.value.charCodeAt(i);
    } //endregion
    //region Create GeneralizedTime from JavaScript Date type


    if ("valueDate" in parameters) {
      this.fromDate(parameters.valueDate);
      this.valueBlock.valueHex = this.toBuffer();
    } //endregion


    this.idBlock.tagClass = 1; // UNIVERSAL

    this.idBlock.tagNumber = 23; // UTCTime
  } //**********************************************************************************

  /**
   * Base function for converting block from BER encoded array of bytes
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   * @param {!number} inputOffset Offset in ASN.1 BER encoded array where decoding should be started
   * @param {!number} inputLength Maximum length of array of bytes which can be using in this function
   * @returns {number} Offset after least decoded byte
   */


  fromBER(inputBuffer, inputOffset, inputLength) {
    const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm === true ? inputLength : this.lenBlock.length);

    if (resultOffset === -1) {
      this.error = this.valueBlock.error;
      return resultOffset;
    }

    this.fromBuffer(this.valueBlock.valueHex);
    if (this.idBlock.error.length === 0) this.blockLength += this.idBlock.blockLength;
    if (this.lenBlock.error.length === 0) this.blockLength += this.lenBlock.blockLength;
    if (this.valueBlock.error.length === 0) this.blockLength += this.valueBlock.blockLength;
    return resultOffset;
  } //**********************************************************************************

  /**
   * Function converting ArrayBuffer into ASN.1 internal string
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   */


  fromBuffer(inputBuffer) {
    this.fromString(String.fromCharCode.apply(null, new Uint8Array(inputBuffer)));
  } //**********************************************************************************

  /**
   * Function converting ASN.1 internal string into ArrayBuffer
   * @returns {ArrayBuffer}
   */


  toBuffer() {
    const str = this.toString();
    const buffer = new ArrayBuffer(str.length);
    const view = new Uint8Array(buffer);

    for (let i = 0; i < str.length; i++) view[i] = str.charCodeAt(i);

    return buffer;
  } //**********************************************************************************

  /**
   * Function converting "Date" object into ASN.1 internal string
   * @param {!Date} inputDate JavaScript "Date" object
   */


  fromDate(inputDate) {
    this.year = inputDate.getUTCFullYear();
    this.month = inputDate.getUTCMonth() + 1;
    this.day = inputDate.getUTCDate();
    this.hour = inputDate.getUTCHours();
    this.minute = inputDate.getUTCMinutes();
    this.second = inputDate.getUTCSeconds();
  } //**********************************************************************************
  //noinspection JSUnusedGlobalSymbols

  /**
   * Function converting ASN.1 internal string into "Date" object
   * @returns {Date}
   */


  toDate() {
    return new Date(Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second));
  } //**********************************************************************************

  /**
   * Function converting JavaScript string into ASN.1 internal class
   * @param {!string} inputString ASN.1 BER encoded array
   */


  fromString(inputString) {
    //region Parse input string
    const parser = /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z/ig;
    const parserArray = parser.exec(inputString);

    if (parserArray === null) {
      this.error = "Wrong input string for convertion";
      return;
    } //endregion
    //region Store parsed values


    const year = parseInt(parserArray[1], 10);
    if (year >= 50) this.year = 1900 + year;else this.year = 2000 + year;
    this.month = parseInt(parserArray[2], 10);
    this.day = parseInt(parserArray[3], 10);
    this.hour = parseInt(parserArray[4], 10);
    this.minute = parseInt(parserArray[5], 10);
    this.second = parseInt(parserArray[6], 10); //endregion
  } //**********************************************************************************

  /**
   * Function converting ASN.1 internal class into JavaScript string
   * @returns {string}
   */


  toString() {
    const outputArray = new Array(7);
    outputArray[0] = (0, _pvutils.padNumber)(this.year < 2000 ? this.year - 1900 : this.year - 2000, 2);
    outputArray[1] = (0, _pvutils.padNumber)(this.month, 2);
    outputArray[2] = (0, _pvutils.padNumber)(this.day, 2);
    outputArray[3] = (0, _pvutils.padNumber)(this.hour, 2);
    outputArray[4] = (0, _pvutils.padNumber)(this.minute, 2);
    outputArray[5] = (0, _pvutils.padNumber)(this.second, 2);
    outputArray[6] = "Z";
    return outputArray.join("");
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "UTCTime";
  } //**********************************************************************************

  /**
   * Convertion for the block to JSON object
   * @returns {Object}
   */


  toJSON() {
    let object = {}; //region Seems at the moment (Sep 2016) there is no way how to check method is supported in "super" object

    try {
      object = super.toJSON();
    } catch (ex) {} //endregion


    object.year = this.year;
    object.month = this.month;
    object.day = this.day;
    object.hour = this.hour;
    object.minute = this.minute;
    object.second = this.second;
    return object;
  } //**********************************************************************************


} //**************************************************************************************

/**
 * @extends VisibleString
 */


exports.UTCTime = UTCTime;

class GeneralizedTime extends VisibleString {
  //**********************************************************************************

  /**
   * Constructor for "GeneralizedTime" class
   * @param {Object} [parameters={}]
   * @property {string} [value] String representatio of the date
   * @property {Date} [valueDate] JavaScript "Date" object
   */
  constructor(parameters = {}) {
    super(parameters);
    this.year = 0;
    this.month = 0;
    this.day = 0;
    this.hour = 0;
    this.minute = 0;
    this.second = 0;
    this.millisecond = 0; //region Create UTCTime from ASN.1 UTC string value

    if ("value" in parameters) {
      this.fromString(parameters.value);
      this.valueBlock.valueHex = new ArrayBuffer(parameters.value.length);
      const view = new Uint8Array(this.valueBlock.valueHex);

      for (let i = 0; i < parameters.value.length; i++) view[i] = parameters.value.charCodeAt(i);
    } //endregion
    //region Create GeneralizedTime from JavaScript Date type


    if ("valueDate" in parameters) {
      this.fromDate(parameters.valueDate);
      this.valueBlock.valueHex = this.toBuffer();
    } //endregion


    this.idBlock.tagClass = 1; // UNIVERSAL

    this.idBlock.tagNumber = 24; // GeneralizedTime
  } //**********************************************************************************

  /**
   * Base function for converting block from BER encoded array of bytes
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   * @param {!number} inputOffset Offset in ASN.1 BER encoded array where decoding should be started
   * @param {!number} inputLength Maximum length of array of bytes which can be using in this function
   * @returns {number} Offset after least decoded byte
   */


  fromBER(inputBuffer, inputOffset, inputLength) {
    const resultOffset = this.valueBlock.fromBER(inputBuffer, inputOffset, this.lenBlock.isIndefiniteForm === true ? inputLength : this.lenBlock.length);

    if (resultOffset === -1) {
      this.error = this.valueBlock.error;
      return resultOffset;
    }

    this.fromBuffer(this.valueBlock.valueHex);
    if (this.idBlock.error.length === 0) this.blockLength += this.idBlock.blockLength;
    if (this.lenBlock.error.length === 0) this.blockLength += this.lenBlock.blockLength;
    if (this.valueBlock.error.length === 0) this.blockLength += this.valueBlock.blockLength;
    return resultOffset;
  } //**********************************************************************************

  /**
   * Function converting ArrayBuffer into ASN.1 internal string
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   */


  fromBuffer(inputBuffer) {
    this.fromString(String.fromCharCode.apply(null, new Uint8Array(inputBuffer)));
  } //**********************************************************************************

  /**
   * Function converting ASN.1 internal string into ArrayBuffer
   * @returns {ArrayBuffer}
   */


  toBuffer() {
    const str = this.toString();
    const buffer = new ArrayBuffer(str.length);
    const view = new Uint8Array(buffer);

    for (let i = 0; i < str.length; i++) view[i] = str.charCodeAt(i);

    return buffer;
  } //**********************************************************************************

  /**
   * Function converting "Date" object into ASN.1 internal string
   * @param {!Date} inputDate JavaScript "Date" object
   */


  fromDate(inputDate) {
    this.year = inputDate.getUTCFullYear();
    this.month = inputDate.getUTCMonth() + 1;
    this.day = inputDate.getUTCDate();
    this.hour = inputDate.getUTCHours();
    this.minute = inputDate.getUTCMinutes();
    this.second = inputDate.getUTCSeconds();
    this.millisecond = inputDate.getUTCMilliseconds();
  } //**********************************************************************************
  //noinspection JSUnusedGlobalSymbols

  /**
   * Function converting ASN.1 internal string into "Date" object
   * @returns {Date}
   */


  toDate() {
    return new Date(Date.UTC(this.year, this.month - 1, this.day, this.hour, this.minute, this.second, this.millisecond));
  } //**********************************************************************************

  /**
   * Function converting JavaScript string into ASN.1 internal class
   * @param {!string} inputString ASN.1 BER encoded array
   */


  fromString(inputString) {
    //region Initial variables
    let isUTC = false;
    let timeString = "";
    let dateTimeString = "";
    let fractionPart = 0;
    let parser;
    let hourDifference = 0;
    let minuteDifference = 0; //endregion
    //region Convert as UTC time

    if (inputString[inputString.length - 1] === "Z") {
      timeString = inputString.substr(0, inputString.length - 1);
      isUTC = true;
    } //endregion
    //region Convert as local time
    else {
        //noinspection JSPrimitiveTypeWrapperUsage
        const number = new Number(inputString[inputString.length - 1]);
        if (isNaN(number.valueOf())) throw new Error("Wrong input string for convertion");
        timeString = inputString;
      } //endregion
    //region Check that we do not have a "+" and "-" symbols inside UTC time


    if (isUTC) {
      if (timeString.indexOf("+") !== -1) throw new Error("Wrong input string for convertion");
      if (timeString.indexOf("-") !== -1) throw new Error("Wrong input string for convertion");
    } //endregion
    //region Get "UTC time difference" in case of local time
    else {
        let multiplier = 1;
        let differencePosition = timeString.indexOf("+");
        let differenceString = "";

        if (differencePosition === -1) {
          differencePosition = timeString.indexOf("-");
          multiplier = -1;
        }

        if (differencePosition !== -1) {
          differenceString = timeString.substr(differencePosition + 1);
          timeString = timeString.substr(0, differencePosition);
          if (differenceString.length !== 2 && differenceString.length !== 4) throw new Error("Wrong input string for convertion"); //noinspection JSPrimitiveTypeWrapperUsage

          let number = new Number(differenceString.substr(0, 2));
          if (isNaN(number.valueOf())) throw new Error("Wrong input string for convertion");
          hourDifference = multiplier * number;

          if (differenceString.length === 4) {
            //noinspection JSPrimitiveTypeWrapperUsage
            number = new Number(differenceString.substr(2, 2));
            if (isNaN(number.valueOf())) throw new Error("Wrong input string for convertion");
            minuteDifference = multiplier * number;
          }
        }
      } //endregion
    //region Get position of fraction point


    let fractionPointPosition = timeString.indexOf("."); // Check for "full stop" symbol

    if (fractionPointPosition === -1) fractionPointPosition = timeString.indexOf(","); // Check for "comma" symbol
    //endregion
    //region Get fraction part

    if (fractionPointPosition !== -1) {
      //noinspection JSPrimitiveTypeWrapperUsage
      const fractionPartCheck = new Number(`0${timeString.substr(fractionPointPosition)}`);
      if (isNaN(fractionPartCheck.valueOf())) throw new Error("Wrong input string for convertion");
      fractionPart = fractionPartCheck.valueOf();
      dateTimeString = timeString.substr(0, fractionPointPosition);
    } else dateTimeString = timeString; //endregion
    //region Parse internal date


    switch (true) {
      case dateTimeString.length === 8:
        // "YYYYMMDD"
        parser = /(\d{4})(\d{2})(\d{2})/ig;
        if (fractionPointPosition !== -1) throw new Error("Wrong input string for convertion"); // Here we should not have a "fraction point"

        break;

      case dateTimeString.length === 10:
        // "YYYYMMDDHH"
        parser = /(\d{4})(\d{2})(\d{2})(\d{2})/ig;

        if (fractionPointPosition !== -1) {
          let fractionResult = 60 * fractionPart;
          this.minute = Math.floor(fractionResult);
          fractionResult = 60 * (fractionResult - this.minute);
          this.second = Math.floor(fractionResult);
          fractionResult = 1000 * (fractionResult - this.second);
          this.millisecond = Math.floor(fractionResult);
        }

        break;

      case dateTimeString.length === 12:
        // "YYYYMMDDHHMM"
        parser = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/ig;

        if (fractionPointPosition !== -1) {
          let fractionResult = 60 * fractionPart;
          this.second = Math.floor(fractionResult);
          fractionResult = 1000 * (fractionResult - this.second);
          this.millisecond = Math.floor(fractionResult);
        }

        break;

      case dateTimeString.length === 14:
        // "YYYYMMDDHHMMSS"
        parser = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/ig;

        if (fractionPointPosition !== -1) {
          const fractionResult = 1000 * fractionPart;
          this.millisecond = Math.floor(fractionResult);
        }

        break;

      default:
        throw new Error("Wrong input string for convertion");
    } //endregion
    //region Put parsed values at right places


    const parserArray = parser.exec(dateTimeString);
    if (parserArray === null) throw new Error("Wrong input string for convertion");

    for (let j = 1; j < parserArray.length; j++) {
      switch (j) {
        case 1:
          this.year = parseInt(parserArray[j], 10);
          break;

        case 2:
          this.month = parseInt(parserArray[j], 10);
          break;

        case 3:
          this.day = parseInt(parserArray[j], 10);
          break;

        case 4:
          this.hour = parseInt(parserArray[j], 10) + hourDifference;
          break;

        case 5:
          this.minute = parseInt(parserArray[j], 10) + minuteDifference;
          break;

        case 6:
          this.second = parseInt(parserArray[j], 10);
          break;

        default:
          throw new Error("Wrong input string for convertion");
      }
    } //endregion
    //region Get final date


    if (isUTC === false) {
      const tempDate = new Date(this.year, this.month, this.day, this.hour, this.minute, this.second, this.millisecond);
      this.year = tempDate.getUTCFullYear();
      this.month = tempDate.getUTCMonth();
      this.day = tempDate.getUTCDay();
      this.hour = tempDate.getUTCHours();
      this.minute = tempDate.getUTCMinutes();
      this.second = tempDate.getUTCSeconds();
      this.millisecond = tempDate.getUTCMilliseconds();
    } //endregion

  } //**********************************************************************************

  /**
   * Function converting ASN.1 internal class into JavaScript string
   * @returns {string}
   */


  toString() {
    const outputArray = [];
    outputArray.push((0, _pvutils.padNumber)(this.year, 4));
    outputArray.push((0, _pvutils.padNumber)(this.month, 2));
    outputArray.push((0, _pvutils.padNumber)(this.day, 2));
    outputArray.push((0, _pvutils.padNumber)(this.hour, 2));
    outputArray.push((0, _pvutils.padNumber)(this.minute, 2));
    outputArray.push((0, _pvutils.padNumber)(this.second, 2));

    if (this.millisecond !== 0) {
      outputArray.push(".");
      outputArray.push((0, _pvutils.padNumber)(this.millisecond, 3));
    }

    outputArray.push("Z");
    return outputArray.join("");
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "GeneralizedTime";
  } //**********************************************************************************

  /**
   * Convertion for the block to JSON object
   * @returns {Object}
   */


  toJSON() {
    let object = {}; //region Seems at the moment (Sep 2016) there is no way how to check method is supported in "super" object

    try {
      object = super.toJSON();
    } catch (ex) {} //endregion


    object.year = this.year;
    object.month = this.month;
    object.day = this.day;
    object.hour = this.hour;
    object.minute = this.minute;
    object.second = this.second;
    object.millisecond = this.millisecond;
    return object;
  } //**********************************************************************************


} //**************************************************************************************

/**
 * @extends Utf8String
 */


exports.GeneralizedTime = GeneralizedTime;

class DATE extends Utf8String {
  //**********************************************************************************

  /**
   * Constructor for "DATE" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1; // UNIVERSAL

    this.idBlock.tagNumber = 31; // DATE
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "DATE";
  } //**********************************************************************************


} //**************************************************************************************

/**
 * @extends Utf8String
 */


exports.DATE = DATE;

class TimeOfDay extends Utf8String {
  //**********************************************************************************

  /**
   * Constructor for "TimeOfDay" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1; // UNIVERSAL

    this.idBlock.tagNumber = 32; // TimeOfDay
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "TimeOfDay";
  } //**********************************************************************************


} //**************************************************************************************

/**
 * @extends Utf8String
 */


exports.TimeOfDay = TimeOfDay;

class DateTime extends Utf8String {
  //**********************************************************************************

  /**
   * Constructor for "DateTime" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1; // UNIVERSAL

    this.idBlock.tagNumber = 33; // DateTime
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "DateTime";
  } //**********************************************************************************


} //**************************************************************************************

/**
 * @extends Utf8String
 */


exports.DateTime = DateTime;

class Duration extends Utf8String {
  //**********************************************************************************

  /**
   * Constructor for "Duration" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1; // UNIVERSAL

    this.idBlock.tagNumber = 34; // Duration
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "Duration";
  } //**********************************************************************************


} //**************************************************************************************

/**
 * @extends Utf8String
 */


exports.Duration = Duration;

class TIME extends Utf8String {
  //**********************************************************************************

  /**
   * Constructor for "Time" class
   * @param {Object} [parameters={}]
   */
  constructor(parameters = {}) {
    super(parameters);
    this.idBlock.tagClass = 1; // UNIVERSAL

    this.idBlock.tagNumber = 14; // Time
  } //**********************************************************************************

  /**
   * Aux function, need to get a block name. Need to have it here for inhiritence
   * @returns {string}
   */


  static blockName() {
    return "TIME";
  } //**********************************************************************************


} //**************************************************************************************
//endregion
//**************************************************************************************
//region Declaration of special ASN.1 schema type Choice
//**************************************************************************************


exports.TIME = TIME;

class Choice {
  //**********************************************************************************

  /**
   * Constructor for "Choice" class
   * @param {Object} [parameters={}]
   * @property {Array} [value] Array of ASN.1 types for make a choice from
   * @property {boolean} [optional]
   */
  constructor(parameters = {}) {
    this.value = (0, _pvutils.getParametersValue)(parameters, "value", []);
    this.optional = (0, _pvutils.getParametersValue)(parameters, "optional", false);
  } //**********************************************************************************


} //**************************************************************************************
//endregion
//**************************************************************************************
//region Declaration of special ASN.1 schema type Any
//**************************************************************************************


exports.Choice = Choice;

class Any {
  //**********************************************************************************

  /**
   * Constructor for "Any" class
   * @param {Object} [parameters={}]
   * @property {string} [name]
   * @property {boolean} [optional]
   */
  constructor(parameters = {}) {
    this.name = (0, _pvutils.getParametersValue)(parameters, "name", "");
    this.optional = (0, _pvutils.getParametersValue)(parameters, "optional", false);
  } //**********************************************************************************


} //**************************************************************************************
//endregion
//**************************************************************************************
//region Declaration of special ASN.1 schema type Repeated
//**************************************************************************************


exports.Any = Any;

class Repeated {
  //**********************************************************************************

  /**
   * Constructor for "Repeated" class
   * @param {Object} [parameters={}]
   * @property {string} [name]
   * @property {boolean} [optional]
   */
  constructor(parameters = {}) {
    this.name = (0, _pvutils.getParametersValue)(parameters, "name", "");
    this.optional = (0, _pvutils.getParametersValue)(parameters, "optional", false);
    this.value = (0, _pvutils.getParametersValue)(parameters, "value", new Any());
    this.local = (0, _pvutils.getParametersValue)(parameters, "local", false); // Could local or global array to store elements
  } //**********************************************************************************


} //**************************************************************************************
//endregion
//**************************************************************************************
//region Declaration of special ASN.1 schema type RawData
//**************************************************************************************

/**
 * @description Special class providing ability to have "toBER/fromBER" for raw ArrayBuffer
 */


exports.Repeated = Repeated;

class RawData {
  //**********************************************************************************

  /**
   * Constructor for "Repeated" class
   * @param {Object} [parameters={}]
   * @property {string} [name]
   * @property {boolean} [optional]
   */
  constructor(parameters = {}) {
    this.data = (0, _pvutils.getParametersValue)(parameters, "data", new ArrayBuffer(0));
  } //**********************************************************************************

  /**
   * Base function for converting block from BER encoded array of bytes
   * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
   * @param {!number} inputOffset Offset in ASN.1 BER encoded array where decoding should be started
   * @param {!number} inputLength Maximum length of array of bytes which can be using in this function
   * @returns {number} Offset after least decoded byte
   */


  fromBER(inputBuffer, inputOffset, inputLength) {
    this.data = inputBuffer.slice(inputOffset, inputLength);
    return inputOffset + inputLength;
  } //**********************************************************************************

  /**
   * Encoding of current ASN.1 block into ASN.1 encoded array (BER rules)
   * @param {boolean} [sizeOnly=false] Flag that we need only a size of encoding, not a real array of bytes
   * @returns {ArrayBuffer}
   */


  toBER(sizeOnly = false) {
    return this.data;
  } //**********************************************************************************


} //**************************************************************************************
//endregion
//**************************************************************************************
//region Major ASN.1 BER decoding function
//**************************************************************************************

/**
 * Internal library function for decoding ASN.1 BER
 * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array
 * @param {!number} inputOffset Offset in ASN.1 BER encoded array where decoding should be started
 * @param {!number} inputLength Maximum length of array of bytes which can be using in this function
 * @returns {{offset: number, result: Object}}
 */


exports.RawData = RawData;

function LocalFromBER(inputBuffer, inputOffset, inputLength) {
  const incomingOffset = inputOffset; // Need to store initial offset since "inputOffset" is changing in the function
  //region Local function changing a type for ASN.1 classes

  function localChangeType(inputObject, newType) {
    if (inputObject instanceof newType) return inputObject;
    const newObject = new newType();
    newObject.idBlock = inputObject.idBlock;
    newObject.lenBlock = inputObject.lenBlock;
    newObject.warnings = inputObject.warnings; //noinspection JSCheckFunctionSignatures

    newObject.valueBeforeDecode = inputObject.valueBeforeDecode.slice(0);
    return newObject;
  } //endregion
  //region Create a basic ASN.1 type since we need to return errors and warnings from the function


  let returnObject = new BaseBlock({}, Object); //endregion
  //region Basic check for parameters

  const baseBlock = new LocalBaseBlock();

  if ((0, _pvutils.checkBufferParams)(baseBlock, inputBuffer, inputOffset, inputLength) === false) {
    returnObject.error = baseBlock.error;
    return {
      offset: -1,
      result: returnObject
    };
  } //endregion
  //region Getting Uint8Array from ArrayBuffer


  const intBuffer = new Uint8Array(inputBuffer, inputOffset, inputLength); //endregion
  //region Initial checks

  if (intBuffer.length === 0) {
    this.error = "Zero buffer length";
    return {
      offset: -1,
      result: returnObject
    };
  } //endregion
  //region Decode indentifcation block of ASN.1 BER structure


  let resultOffset = returnObject.idBlock.fromBER(inputBuffer, inputOffset, inputLength);
  returnObject.warnings.concat(returnObject.idBlock.warnings);

  if (resultOffset === -1) {
    returnObject.error = returnObject.idBlock.error;
    return {
      offset: -1,
      result: returnObject
    };
  }

  inputOffset = resultOffset;
  inputLength -= returnObject.idBlock.blockLength; //endregion
  //region Decode length block of ASN.1 BER structure

  resultOffset = returnObject.lenBlock.fromBER(inputBuffer, inputOffset, inputLength);
  returnObject.warnings.concat(returnObject.lenBlock.warnings);

  if (resultOffset === -1) {
    returnObject.error = returnObject.lenBlock.error;
    return {
      offset: -1,
      result: returnObject
    };
  }

  inputOffset = resultOffset;
  inputLength -= returnObject.lenBlock.blockLength; //endregion
  //region Check for usign indefinite length form in encoding for primitive types

  if (returnObject.idBlock.isConstructed === false && returnObject.lenBlock.isIndefiniteForm === true) {
    returnObject.error = "Indefinite length form used for primitive encoding form";
    return {
      offset: -1,
      result: returnObject
    };
  } //endregion
  //region Switch ASN.1 block type


  let newASN1Type = BaseBlock;

  switch (returnObject.idBlock.tagClass) {
    //region UNIVERSAL
    case 1:
      //region Check for reserved tag numbers
      if (returnObject.idBlock.tagNumber >= 37 && returnObject.idBlock.isHexOnly === false) {
        returnObject.error = "UNIVERSAL 37 and upper tags are reserved by ASN.1 standard";
        return {
          offset: -1,
          result: returnObject
        };
      } //endregion


      switch (returnObject.idBlock.tagNumber) {
        //region EndOfContent type
        case 0:
          //region Check for EndOfContent type
          if (returnObject.idBlock.isConstructed === true && returnObject.lenBlock.length > 0) {
            returnObject.error = "Type [UNIVERSAL 0] is reserved";
            return {
              offset: -1,
              result: returnObject
            };
          } //endregion


          newASN1Type = EndOfContent;
          break;
        //endregion
        //region Boolean type

        case 1:
          newASN1Type = Boolean;
          break;
        //endregion
        //region Integer type

        case 2:
          newASN1Type = Integer;
          break;
        //endregion
        //region BitString type

        case 3:
          newASN1Type = BitString;
          break;
        //endregion
        //region OctetString type

        case 4:
          newASN1Type = OctetString;
          break;
        //endregion
        //region Null type

        case 5:
          newASN1Type = Null;
          break;
        //endregion
        //region OBJECT IDENTIFIER type

        case 6:
          newASN1Type = ObjectIdentifier;
          break;
        //endregion
        //region Enumerated type

        case 10:
          newASN1Type = Enumerated;
          break;
        //endregion
        //region Utf8String type

        case 12:
          newASN1Type = Utf8String;
          break;
        //endregion
        //region Time type
        //region RELATIVE OBJECT IDENTIFIER type

        case 13:
          newASN1Type = RelativeObjectIdentifier;
          break;
        //endregion

        case 14:
          newASN1Type = TIME;
          break;
        //endregion
        //region ASN.1 reserved type

        case 15:
          returnObject.error = "[UNIVERSAL 15] is reserved by ASN.1 standard";
          return {
            offset: -1,
            result: returnObject
          };
        //endregion
        //region Sequence type

        case 16:
          newASN1Type = Sequence;
          break;
        //endregion
        //region Set type

        case 17:
          newASN1Type = Set;
          break;
        //endregion
        //region NumericString type

        case 18:
          newASN1Type = NumericString;
          break;
        //endregion
        //region PrintableString type

        case 19:
          newASN1Type = PrintableString;
          break;
        //endregion
        //region TeletexString type

        case 20:
          newASN1Type = TeletexString;
          break;
        //endregion
        //region VideotexString type

        case 21:
          newASN1Type = VideotexString;
          break;
        //endregion
        //region IA5String type

        case 22:
          newASN1Type = IA5String;
          break;
        //endregion
        //region UTCTime type

        case 23:
          newASN1Type = UTCTime;
          break;
        //endregion
        //region GeneralizedTime type

        case 24:
          newASN1Type = GeneralizedTime;
          break;
        //endregion
        //region GraphicString type

        case 25:
          newASN1Type = GraphicString;
          break;
        //endregion
        //region VisibleString type

        case 26:
          newASN1Type = VisibleString;
          break;
        //endregion
        //region GeneralString type

        case 27:
          newASN1Type = GeneralString;
          break;
        //endregion
        //region UniversalString type

        case 28:
          newASN1Type = UniversalString;
          break;
        //endregion
        //region CharacterString type

        case 29:
          newASN1Type = CharacterString;
          break;
        //endregion
        //region BmpString type

        case 30:
          newASN1Type = BmpString;
          break;
        //endregion
        //region DATE type

        case 31:
          newASN1Type = DATE;
          break;
        //endregion
        //region TimeOfDay type

        case 32:
          newASN1Type = TimeOfDay;
          break;
        //endregion
        //region Date-Time type

        case 33:
          newASN1Type = DateTime;
          break;
        //endregion
        //region Duration type

        case 34:
          newASN1Type = Duration;
          break;
        //endregion
        //region default

        default:
          {
            let newObject;
            if (returnObject.idBlock.isConstructed === true) newObject = new Constructed();else newObject = new Primitive();
            newObject.idBlock = returnObject.idBlock;
            newObject.lenBlock = returnObject.lenBlock;
            newObject.warnings = returnObject.warnings;
            returnObject = newObject;
            resultOffset = returnObject.fromBER(inputBuffer, inputOffset, inputLength);
          }
        //endregion
      }

      break;
    //endregion
    //region All other tag classes

    case 2: // APPLICATION

    case 3: // CONTEXT-SPECIFIC

    case 4: // PRIVATE

    default:
      {
        if (returnObject.idBlock.isConstructed === true) newASN1Type = Constructed;else newASN1Type = Primitive;
      }
    //endregion
  } //endregion
  //region Change type and perform BER decoding


  returnObject = localChangeType(returnObject, newASN1Type);
  resultOffset = returnObject.fromBER(inputBuffer, inputOffset, returnObject.lenBlock.isIndefiniteForm === true ? inputLength : returnObject.lenBlock.length); //endregion
  //region Coping incoming buffer for entire ASN.1 block

  returnObject.valueBeforeDecode = inputBuffer.slice(incomingOffset, incomingOffset + returnObject.blockLength); //endregion

  return {
    offset: resultOffset,
    result: returnObject
  };
} //**************************************************************************************

/**
 * Major function for decoding ASN.1 BER array into internal library structuries
 * @param {!ArrayBuffer} inputBuffer ASN.1 BER encoded array of bytes
 */


function fromBER(inputBuffer) {
  if (inputBuffer.byteLength === 0) {
    const result = new BaseBlock({}, Object);
    result.error = "Input buffer has zero length";
    return {
      offset: -1,
      result
    };
  }

  return LocalFromBER(inputBuffer, 0, inputBuffer.byteLength);
} //**************************************************************************************
//endregion
//**************************************************************************************
//region Major scheme verification function
//**************************************************************************************

/**
 * Compare of two ASN.1 object trees
 * @param {!Object} root Root of input ASN.1 object tree
 * @param {!Object} inputData Input ASN.1 object tree
 * @param {!Object} inputSchema Input ASN.1 schema to compare with
 * @return {{verified: boolean}|{verified:boolean, result: Object}}
 */


function compareSchema(root, inputData, inputSchema) {
  //region Special case for Choice schema element type
  if (inputSchema instanceof Choice) {
    const choiceResult = false;

    for (let j = 0; j < inputSchema.value.length; j++) {
      const result = compareSchema(root, inputData, inputSchema.value[j]);

      if (result.verified === true) {
        return {
          verified: true,
          result: root
        };
      }
    }

    if (choiceResult === false) {
      const _result = {
        verified: false,
        result: {
          error: "Wrong values for Choice type"
        }
      };
      if (inputSchema.hasOwnProperty("name")) _result.name = inputSchema.name;
      return _result;
    }
  } //endregion
  //region Special case for Any schema element type


  if (inputSchema instanceof Any) {
    //region Add named component of ASN.1 schema
    if (inputSchema.hasOwnProperty("name")) root[inputSchema.name] = inputData; //endregion

    return {
      verified: true,
      result: root
    };
  } //endregion
  //region Initial check


  if (root instanceof Object === false) {
    return {
      verified: false,
      result: {
        error: "Wrong root object"
      }
    };
  }

  if (inputData instanceof Object === false) {
    return {
      verified: false,
      result: {
        error: "Wrong ASN.1 data"
      }
    };
  }

  if (inputSchema instanceof Object === false) {
    return {
      verified: false,
      result: {
        error: "Wrong ASN.1 schema"
      }
    };
  }

  if ("idBlock" in inputSchema === false) {
    return {
      verified: false,
      result: {
        error: "Wrong ASN.1 schema"
      }
    };
  } //endregion
  //region Comparing idBlock properties in ASN.1 data and ASN.1 schema
  //region Encode and decode ASN.1 schema idBlock
  /// <remarks>This encoding/decoding is neccessary because could be an errors in schema definition</remarks>


  if ("fromBER" in inputSchema.idBlock === false) {
    return {
      verified: false,
      result: {
        error: "Wrong ASN.1 schema"
      }
    };
  }

  if ("toBER" in inputSchema.idBlock === false) {
    return {
      verified: false,
      result: {
        error: "Wrong ASN.1 schema"
      }
    };
  }

  const encodedId = inputSchema.idBlock.toBER(false);

  if (encodedId.byteLength === 0) {
    return {
      verified: false,
      result: {
        error: "Error encoding idBlock for ASN.1 schema"
      }
    };
  }

  const decodedOffset = inputSchema.idBlock.fromBER(encodedId, 0, encodedId.byteLength);

  if (decodedOffset === -1) {
    return {
      verified: false,
      result: {
        error: "Error decoding idBlock for ASN.1 schema"
      }
    };
  } //endregion
  //region tagClass


  if (inputSchema.idBlock.hasOwnProperty("tagClass") === false) {
    return {
      verified: false,
      result: {
        error: "Wrong ASN.1 schema"
      }
    };
  }

  if (inputSchema.idBlock.tagClass !== inputData.idBlock.tagClass) {
    return {
      verified: false,
      result: root
    };
  } //endregion
  //region tagNumber


  if (inputSchema.idBlock.hasOwnProperty("tagNumber") === false) {
    return {
      verified: false,
      result: {
        error: "Wrong ASN.1 schema"
      }
    };
  }

  if (inputSchema.idBlock.tagNumber !== inputData.idBlock.tagNumber) {
    return {
      verified: false,
      result: root
    };
  } //endregion
  //region isConstructed


  if (inputSchema.idBlock.hasOwnProperty("isConstructed") === false) {
    return {
      verified: false,
      result: {
        error: "Wrong ASN.1 schema"
      }
    };
  }

  if (inputSchema.idBlock.isConstructed !== inputData.idBlock.isConstructed) {
    return {
      verified: false,
      result: root
    };
  } //endregion
  //region isHexOnly


  if ("isHexOnly" in inputSchema.idBlock === false) // Since 'isHexOnly' is an inhirited property
    {
      return {
        verified: false,
        result: {
          error: "Wrong ASN.1 schema"
        }
      };
    }

  if (inputSchema.idBlock.isHexOnly !== inputData.idBlock.isHexOnly) {
    return {
      verified: false,
      result: root
    };
  } //endregion
  //region valueHex


  if (inputSchema.idBlock.isHexOnly === true) {
    if ("valueHex" in inputSchema.idBlock === false) // Since 'valueHex' is an inhirited property
      {
        return {
          verified: false,
          result: {
            error: "Wrong ASN.1 schema"
          }
        };
      }

    const schemaView = new Uint8Array(inputSchema.idBlock.valueHex);
    const asn1View = new Uint8Array(inputData.idBlock.valueHex);

    if (schemaView.length !== asn1View.length) {
      return {
        verified: false,
        result: root
      };
    }

    for (let i = 0; i < schemaView.length; i++) {
      if (schemaView[i] !== asn1View[1]) {
        return {
          verified: false,
          result: root
        };
      }
    }
  } //endregion
  //endregion
  //region Add named component of ASN.1 schema


  if (inputSchema.hasOwnProperty("name")) {
    inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, "");
    if (inputSchema.name !== "") root[inputSchema.name] = inputData;
  } //endregion
  //region Getting next ASN.1 block for comparition


  if (inputSchema.idBlock.isConstructed === true) {
    let admission = 0;
    let result = {
      verified: false
    };
    let maxLength = inputSchema.valueBlock.value.length;

    if (maxLength > 0) {
      if (inputSchema.valueBlock.value[0] instanceof Repeated) maxLength = inputData.valueBlock.value.length;
    } //region Special case when constructive value has no elements


    if (maxLength === 0) {
      return {
        verified: true,
        result: root
      };
    } //endregion
    //region Special case when "inputData" has no values and "inputSchema" has all optional values


    if (inputData.valueBlock.value.length === 0 && inputSchema.valueBlock.value.length !== 0) {
      let _optional = true;

      for (let i = 0; i < inputSchema.valueBlock.value.length; i++) _optional = _optional && (inputSchema.valueBlock.value[i].optional || false);

      if (_optional === true) {
        return {
          verified: true,
          result: root
        };
      } //region Delete early added name of block


      if (inputSchema.hasOwnProperty("name")) {
        inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, "");
        if (inputSchema.name !== "") delete root[inputSchema.name];
      } //endregion


      root.error = "Inconsistent object length";
      return {
        verified: false,
        result: root
      };
    } //endregion


    for (let i = 0; i < maxLength; i++) {
      //region Special case when there is an "optional" element of ASN.1 schema at the end
      if (i - admission >= inputData.valueBlock.value.length) {
        if (inputSchema.valueBlock.value[i].optional === false) {
          const _result = {
            verified: false,
            result: root
          };
          root.error = "Inconsistent length between ASN.1 data and schema"; //region Delete early added name of block

          if (inputSchema.hasOwnProperty("name")) {
            inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, "");

            if (inputSchema.name !== "") {
              delete root[inputSchema.name];
              _result.name = inputSchema.name;
            }
          } //endregion


          return _result;
        }
      } //endregion
      else {
          //region Special case for Repeated type of ASN.1 schema element
          if (inputSchema.valueBlock.value[0] instanceof Repeated) {
            result = compareSchema(root, inputData.valueBlock.value[i], inputSchema.valueBlock.value[0].value);

            if (result.verified === false) {
              if (inputSchema.valueBlock.value[0].optional === true) admission++;else {
                //region Delete early added name of block
                if (inputSchema.hasOwnProperty("name")) {
                  inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, "");
                  if (inputSchema.name !== "") delete root[inputSchema.name];
                } //endregion


                return result;
              }
            }

            if ("name" in inputSchema.valueBlock.value[0] && inputSchema.valueBlock.value[0].name.length > 0) {
              let arrayRoot = {};
              if ("local" in inputSchema.valueBlock.value[0] && inputSchema.valueBlock.value[0].local === true) arrayRoot = inputData;else arrayRoot = root;
              if (typeof arrayRoot[inputSchema.valueBlock.value[0].name] === "undefined") arrayRoot[inputSchema.valueBlock.value[0].name] = [];
              arrayRoot[inputSchema.valueBlock.value[0].name].push(inputData.valueBlock.value[i]);
            }
          } //endregion
          else {
              result = compareSchema(root, inputData.valueBlock.value[i - admission], inputSchema.valueBlock.value[i]);

              if (result.verified === false) {
                if (inputSchema.valueBlock.value[i].optional === true) admission++;else {
                  //region Delete early added name of block
                  if (inputSchema.hasOwnProperty("name")) {
                    inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, "");
                    if (inputSchema.name !== "") delete root[inputSchema.name];
                  } //endregion


                  return result;
                }
              }
            }
        }
    }

    if (result.verified === false) // The situation may take place if last element is "optional" and verification failed
      {
        const _result = {
          verified: false,
          result: root
        }; //region Delete early added name of block

        if (inputSchema.hasOwnProperty("name")) {
          inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, "");

          if (inputSchema.name !== "") {
            delete root[inputSchema.name];
            _result.name = inputSchema.name;
          }
        } //endregion


        return _result;
      }

    return {
      verified: true,
      result: root
    };
  } //endregion
  //region Ability to parse internal value for primitive-encoded value (value of OctetString, for example)


  if ("primitiveSchema" in inputSchema && "valueHex" in inputData.valueBlock) {
    //region Decoding of raw ASN.1 data
    const asn1 = fromBER(inputData.valueBlock.valueHex);

    if (asn1.offset === -1) {
      const _result = {
        verified: false,
        result: asn1.result
      }; //region Delete early added name of block

      if (inputSchema.hasOwnProperty("name")) {
        inputSchema.name = inputSchema.name.replace(/^\s+|\s+$/g, "");

        if (inputSchema.name !== "") {
          delete root[inputSchema.name];
          _result.name = inputSchema.name;
        }
      } //endregion


      return _result;
    } //endregion


    return compareSchema(root, asn1.result, inputSchema.primitiveSchema);
  }

  return {
    verified: true,
    result: root
  }; //endregion
} //**************************************************************************************
//noinspection JSUnusedGlobalSymbols

/**
 * ASN.1 schema verification for ArrayBuffer data
 * @param {!ArrayBuffer} inputBuffer Input BER-encoded ASN.1 data
 * @param {!Object} inputSchema Input ASN.1 schema to verify against to
 * @return {{verified: boolean}|{verified:boolean, result: Object}}
 */


function verifySchema(inputBuffer, inputSchema) {
  //region Initial check
  if (inputSchema instanceof Object === false) {
    return {
      verified: false,
      result: {
        error: "Wrong ASN.1 schema type"
      }
    };
  } //endregion
  //region Decoding of raw ASN.1 data


  const asn1 = fromBER(inputBuffer);

  if (asn1.offset === -1) {
    return {
      verified: false,
      result: asn1.result
    };
  } //endregion
  //region Compare ASN.1 struct with input schema


  return compareSchema(asn1.result, asn1.result, inputSchema); //endregion
} //**************************************************************************************
//endregion
//**************************************************************************************
//region Major function converting JSON to ASN.1 objects
//**************************************************************************************
//noinspection JSUnusedGlobalSymbols

/**
 * Converting from JSON to ASN.1 objects
 * @param {string|Object} json JSON string or object to convert to ASN.1 objects
 */


function fromJSON(json) {} // TODO Implement
//**************************************************************************************
//endregion
//**************************************************************************************
//# sourceMappingURL=asn1.js.map

/***/ },

/***/ "./node_modules/pkijs/src/AlgorithmIdentifier.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js__ = __webpack_require__("./node_modules/asn1js/build/asn1.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_asn1js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pvutils__ = __webpack_require__("./node_modules/pvutils/src/utils.js");


//**************************************************************************************
/**
 * Class from RFC5280
 */
class AlgorithmIdentifier
{
	//**********************************************************************************
	/**
	 * Constructor for AlgorithmIdentifier class
	 * @param {Object} [parameters={}]
	 * @param {Object} [parameters.schema] asn1js parsed value to initialize the class from
	 * @property {string} [algorithmId] ObjectIdentifier for algorithm (string representation)
	 */
	constructor(parameters = {})
	{
		//region Internal properties of the object
		/**
		 * @type {string}
		 * @desc ObjectIdentifier for algorithm (string representation)
		 */
		this.algorithmId = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "algorithmId", AlgorithmIdentifier.defaultValues("algorithmId"));

		if("algorithmParams" in parameters)
			/**
			 * @type {Object}
			 * @desc Any algorithm parameters
			 */
			this.algorithmParams = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "algorithmParams", AlgorithmIdentifier.defaultValues("algorithmParams"));
		//endregion

		//region If input argument array contains "schema" for this object
		if("schema" in parameters)
			this.fromSchema(parameters.schema);
		//endregion
	}
	//**********************************************************************************
	/**
	 * Return default values for all class members
	 * @param {string} memberName String name for a class member
	 */
	static defaultValues(memberName)
	{
		switch(memberName)
		{
			case "algorithmId":
				return "";
			case "algorithmParams":
				return new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Any"]();
			default:
				throw new Error(`Invalid member name for AlgorithmIdentifier class: ${memberName}`);
		}
	}
	//**********************************************************************************
	/**
	 * Compare values with default values for all class members
	 * @param {string} memberName String name for a class member
	 * @param {*} memberValue Value to compare with default value
	 */
	static compareWithDefault(memberName, memberValue)
	{
		switch(memberName)
		{
			case "algorithmId":
				return (memberValue === "");
			case "algorithmParams":
				return (memberValue instanceof __WEBPACK_IMPORTED_MODULE_0_asn1js__["Any"]);
			default:
				throw new Error(`Invalid member name for AlgorithmIdentifier class: ${memberName}`);
		}
	}
	//**********************************************************************************
	/**
	 * Return value of pre-defined ASN.1 schema for current class
	 *
	 * ASN.1 schema:
	 * ```asn1
	 * AlgorithmIdentifier  ::=  Sequence  {
	 *    algorithm               OBJECT IDENTIFIER,
	 *    parameters              ANY DEFINED BY algorithm OPTIONAL  }
	 * ```
	 *
	 * @param {Object} parameters Input parameters for the schema
	 * @returns {Object} asn1js schema object
	 */
	static schema(parameters = {})
	{
		/**
		 * @type {Object}
		 * @property {string} algorithmIdentifier ObjectIdentifier for the algorithm
		 * @property {string} algorithmParams Any algorithm parameters
		 */
		const names = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "names", {});

		return (new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
			name: (names.blockName || ""),
			optional: (names.optional || false),
			value: [
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["ObjectIdentifier"]({ name: (names.algorithmIdentifier || "") }),
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Any"]({ name: (names.algorithmParams || ""), optional: true })
			]
		}));
	}
	//**********************************************************************************
	/**
	 * Convert parsed asn1js object into current class
	 * @param {!Object} schema
	 */
	fromSchema(schema)
	{
		//region Clear input data first
		__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["clearProps"])(schema, [
			"algorithm",
			"params"
		]);
		//endregion
		
		//region Check the schema is valid
		const asn1 = __WEBPACK_IMPORTED_MODULE_0_asn1js__["compareSchema"](schema,
			schema,
			AlgorithmIdentifier.schema({
				names: {
					algorithmIdentifier: "algorithm",
					algorithmParams: "params"
				}
			})
		);

		if(asn1.verified === false)
			throw new Error("Object's schema was not verified against input data for AlgorithmIdentifier");
		//endregion

		//region Get internal properties from parsed schema
		this.algorithmId = asn1.result.algorithm.valueBlock.toString();
		if("params" in asn1.result)
			this.algorithmParams = asn1.result.params;
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convert current object to asn1js object and set correct values
	 * @returns {Object} asn1js object
	 */
	toSchema()
	{
		//region Create array for output sequence
		const outputArray = [];
		
		outputArray.push(new __WEBPACK_IMPORTED_MODULE_0_asn1js__["ObjectIdentifier"]({ value: this.algorithmId }));
		if(("algorithmParams" in this) && ((this.algorithmParams instanceof __WEBPACK_IMPORTED_MODULE_0_asn1js__["Any"]) === false))
			outputArray.push(this.algorithmParams);
		//endregion
		
		//region Construct and return new ASN.1 schema for this object
		return (new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
			value: outputArray
		}));
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convertion for the class to JSON object
	 * @returns {Object}
	 */
	toJSON()
	{
		const object = {
			algorithmId: this.algorithmId
		};

		if(("algorithmParams" in this) && ((this.algorithmParams instanceof __WEBPACK_IMPORTED_MODULE_0_asn1js__["Any"]) === false))
			object.algorithmParams = this.algorithmParams.toJSON();

		return object;
	}
	//**********************************************************************************
	/**
	 * Check that two "AlgorithmIdentifiers" are equal
	 * @param {AlgorithmIdentifier} algorithmIdentifier
	 * @returns {boolean}
	 */
	isEqual(algorithmIdentifier)
	{
		//region Check input type
		if((algorithmIdentifier instanceof AlgorithmIdentifier) === false)
			return false;
		//endregion

		//region Check "algorithm_id"
		if(this.algorithmId !== algorithmIdentifier.algorithmId)
			return false;
		//endregion

		//region Check "algorithm_params"
		if("algorithmParams" in this)
		{
			if("algorithmParams" in algorithmIdentifier)
				return JSON.stringify(this.algorithmParams) === JSON.stringify(algorithmIdentifier.algorithmParams);

			return false;
		}

		if("algorithmParams" in algorithmIdentifier)
			return false;
		//endregion

		return true;
	}
	//**********************************************************************************
}/* harmony export */ exports["a"] = AlgorithmIdentifier;
//**************************************************************************************


/***/ },

/***/ "./node_modules/pkijs/src/Attribute.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js__ = __webpack_require__("./node_modules/asn1js/build/asn1.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_asn1js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pvutils__ = __webpack_require__("./node_modules/pvutils/src/utils.js");


//**************************************************************************************
/**
 * Class from RFC2986
 */
class Attribute {
	//**********************************************************************************
	/**
	 * Constructor for Attribute class
	 * @param {Object} [parameters={}]
	 * @param {Object} [parameters.schema] asn1js parsed value to initialize the class from
	 */
	constructor(parameters = {})
	{
		//region Internal properties of the object
		/**
		 * @type {string}
		 * @desc ObjectIdentifier for attribute (string representation)
		 */
		this.type = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "type", Attribute.defaultValues("type"));
		/**
		 * @type {Array}
		 * @desc Any attribute values
		 */
		this.values = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "values", Attribute.defaultValues("values"));
		//endregion
		
		//region If input argument array contains "schema" for this object
		if("schema" in parameters)
			this.fromSchema(parameters.schema);
		//endregion
	}
	//**********************************************************************************
	/**
	 * Return default values for all class members
	 * @param {string} memberName String name for a class member
	 */
	static defaultValues(memberName)
	{
		switch(memberName)
		{
			case "type":
				return "";
			case "values":
				return [];
			default:
				throw new Error(`Invalid member name for Attribute class: ${memberName}`);
		}
	}
	//**********************************************************************************
	/**
	 * Compare values with default values for all class members
	 * @param {string} memberName String name for a class member
	 * @param {*} memberValue Value to compare with default value
	 */
	static compareWithDefault(memberName, memberValue)
	{
		switch(memberName)
		{
			case "type":
				return (memberValue === "");
			case "values":
				return (memberValue.length === 0);
			default:
				throw new Error(`Invalid member name for Attribute class: ${memberName}`);
		}
	}
	//**********************************************************************************
	/**
	 * Return value of pre-defined ASN.1 schema for current class
	 *
	 * ASN.1 schema:
	 * ```asn1
	 * Attribute { ATTRIBUTE:IOSet } ::= SEQUENCE {
	 *    type   ATTRIBUTE.&id({IOSet}),
	 *    values SET SIZE(1..MAX) OF ATTRIBUTE.&Type({IOSet}{@type})
	 * }
	 * ```
	 *
	 * @param {Object} parameters Input parameters for the schema
	 * @returns {Object} asn1js schema object
	 */
	static schema(parameters = {})
	{
		/**
		 * @type {Object}
		 * @property {string} [blockName]
		 * @property {string} [type]
		 * @property {string} [setName]
		 * @property {string} [values]
		 */
		const names = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "names", {});
		
		return (new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
			name: (names.blockName || ""),
			value: [
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["ObjectIdentifier"]({ name: (names.type || "") }),
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Set"]({
					name: (names.setName || ""),
					value: [
						new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Repeated"]({
							name: (names.values || ""),
							value: new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Any"]()
						})
					]
				})
			]
		}));
	}
	//**********************************************************************************
	/**
	 * Convert parsed asn1js object into current class
	 * @param {!Object} schema
	 */
	fromSchema(schema)
	{
		//region Clear input data first
		__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["clearProps"])(schema, [
			"type",
			"values"
		]);
		//endregion
		
		//region Check the schema is valid
		const asn1 = __WEBPACK_IMPORTED_MODULE_0_asn1js__["compareSchema"](schema,
			schema,
			Attribute.schema({
				names: {
					type: "type",
					values: "values"
				}
			})
		);
		
		if(asn1.verified === false)
			throw new Error("Object's schema was not verified against input data for Attribute");
		//endregion
		
		//region Get internal properties from parsed schema
		this.type = asn1.result.type.valueBlock.toString();
		this.values = asn1.result.values;
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convert current object to asn1js object and set correct values
	 * @returns {Object} asn1js object
	 */
	toSchema()
	{
		//region Construct and return new ASN.1 schema for this object
		return (new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
			value: [
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["ObjectIdentifier"]({ value: this.type }),
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Set"]({
					value: this.values
				})
			]
		}));
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convertion for the class to JSON object
	 * @returns {Object}
	 */
	toJSON()
	{
		return {
			type: this.type,
			values: Array.from(this.values, element => element.toJSON())
		};
	}
	//**********************************************************************************
}/* harmony export */ exports["a"] = Attribute;
//**************************************************************************************


/***/ },

/***/ "./node_modules/pkijs/src/AttributeTypeAndValue.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js__ = __webpack_require__("./node_modules/asn1js/build/asn1.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_asn1js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pvutils__ = __webpack_require__("./node_modules/pvutils/src/utils.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_js__ = __webpack_require__("./node_modules/pkijs/src/common.js");



//**************************************************************************************
/**
 * Class from RFC5280
 */
class AttributeTypeAndValue
{
	//**********************************************************************************
	/**
	 * Constructor for AttributeTypeAndValue class
	 * @param {Object} [parameters={}]
	 * @param {Object} [parameters.schema] asn1js parsed value to initialize the class from
	 */
	constructor(parameters = {})
	{
		//region Internal properties of the object
		/**
		 * @type {string}
		 * @desc type
		 */
		this.type = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "type", AttributeTypeAndValue.defaultValues("type"));
		/**
		 * @type {Object}
		 * @desc Value of the AttributeTypeAndValue class
		 */
		this.value = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "value", AttributeTypeAndValue.defaultValues("value"));
		//endregion

		//region If input argument array contains "schema" for this object
		if("schema" in parameters)
			this.fromSchema(parameters.schema);
		//endregion
	}
	//**********************************************************************************
	/**
	 * Return default values for all class members
	 * @param {string} memberName String name for a class member
	 */
	static defaultValues(memberName)
	{
		switch(memberName)
		{
			case "type":
				return "";
			case "value":
				return {};
			default:
				throw new Error(`Invalid member name for AttributeTypeAndValue class: ${memberName}`);
		}
	}
	//**********************************************************************************
	/**
	 * Return value of pre-defined ASN.1 schema for current class
	 *
	 * ASN.1 schema:
	 * ```asn1
	 * AttributeTypeAndValue ::= Sequence {
	 *    type     AttributeType,
	 *    value    AttributeValue }
	 *
	 * AttributeType ::= OBJECT IDENTIFIER
	 *
	 * AttributeValue ::= ANY -- DEFINED BY AttributeType
	 * ```
	 *
	 * @param {Object} parameters Input parameters for the schema
	 * @returns {Object} asn1js schema object
	 */
	static schema(parameters = {})
	{
		/**
		 * @type {Object}
		 * @property {string} [blockName] Name for entire block
		 * @property {string} [type] Name for "type" element
		 * @property {string} [value] Name for "value" element
		 */
		const names = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "names", {});

		return (new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
			name: (names.blockName || ""),
			value: [
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["ObjectIdentifier"]({ name: (names.type || "") }),
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Any"]({ name: (names.value || "") })
			]
		}));
	}
	//**********************************************************************************
	static blockName()
	{
		return "AttributeTypeAndValue";
	}
	//**********************************************************************************
	/**
	 * Convert parsed asn1js object into current class
	 * @param {!Object} schema
	 */
	fromSchema(schema)
	{
		//region Clear input data first
		__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["clearProps"])(schema, [
			"type",
			"typeValue"
		]);
		//endregion
		
		//region Check the schema is valid
		const asn1 = __WEBPACK_IMPORTED_MODULE_0_asn1js__["compareSchema"](schema,
			schema,
			AttributeTypeAndValue.schema({
				names: {
					type: "type",
					value: "typeValue"
				}
			})
		);

		if(asn1.verified === false)
			throw new Error("Object's schema was not verified against input data for AttributeTypeAndValue");
		//endregion

		//region Get internal properties from parsed schema
		this.type = asn1.result.type.valueBlock.toString();
		// noinspection JSUnresolvedVariable
		this.value = asn1.result.typeValue;
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convert current object to asn1js object and set correct values
	 * @returns {Object} asn1js object
	 */
	toSchema()
	{
		//region Construct and return new ASN.1 schema for this object
		return (new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
			value: [
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["ObjectIdentifier"]({ value: this.type }),
				this.value
			]
		}));
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convertion for the class to JSON object
	 * @returns {Object}
	 */
	toJSON()
	{
		const _object = {
			type: this.type
		};

		if(Object.keys(this.value).length !== 0)
			_object.value = this.value.toJSON();
		else
			_object.value = this.value;

		return _object;
	}
	//**********************************************************************************
	/**
	 * Compare two AttributeTypeAndValue values, or AttributeTypeAndValue with ArrayBuffer value
	 * @param {(AttributeTypeAndValue|ArrayBuffer)} compareTo The value compare to current
	 * @returns {boolean}
	 */
	isEqual(compareTo)
	{
		const stringBlockNames = [
			__WEBPACK_IMPORTED_MODULE_0_asn1js__["Utf8String"].blockName(),
			__WEBPACK_IMPORTED_MODULE_0_asn1js__["BmpString"].blockName(),
			__WEBPACK_IMPORTED_MODULE_0_asn1js__["UniversalString"].blockName(),
			__WEBPACK_IMPORTED_MODULE_0_asn1js__["NumericString"].blockName(),
			__WEBPACK_IMPORTED_MODULE_0_asn1js__["PrintableString"].blockName(),
			__WEBPACK_IMPORTED_MODULE_0_asn1js__["TeletexString"].blockName(),
			__WEBPACK_IMPORTED_MODULE_0_asn1js__["VideotexString"].blockName(),
			__WEBPACK_IMPORTED_MODULE_0_asn1js__["IA5String"].blockName(),
			__WEBPACK_IMPORTED_MODULE_0_asn1js__["GraphicString"].blockName(),
			__WEBPACK_IMPORTED_MODULE_0_asn1js__["VisibleString"].blockName(),
			__WEBPACK_IMPORTED_MODULE_0_asn1js__["GeneralString"].blockName(),
			__WEBPACK_IMPORTED_MODULE_0_asn1js__["CharacterString"].blockName()
		];

		if(compareTo.constructor.blockName() === AttributeTypeAndValue.blockName())
		{
			if(this.type !== compareTo.type)
				return false;

			//region Check we do have both strings
			let isString = false;
			const thisName = this.value.constructor.blockName();

			if(thisName === compareTo.value.constructor.blockName())
			{
				for(const name of stringBlockNames)
				{
					if(thisName === name)
					{
						isString = true;
						break;
					}
				}
			}
			//endregion

			if(isString)
			{
				const value1 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__common_js__["d" /* stringPrep */])(this.value.valueBlock.value);
				const value2 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__common_js__["d" /* stringPrep */])(compareTo.value.valueBlock.value);

				if(value1.localeCompare(value2) !== 0)
					return false;
			}
			else // Comparing as two ArrayBuffers
			{
				if(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["isEqualBuffer"])(this.value.valueBeforeDecode, compareTo.value.valueBeforeDecode) === false)
					return false;
			}

			return true;
		}

		if(compareTo instanceof ArrayBuffer)
			return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["isEqualBuffer"])(this.value.valueBeforeDecode, compareTo);

		return false;
	}
	//**********************************************************************************
}/* harmony export */ exports["default"] = AttributeTypeAndValue;
//**************************************************************************************


/***/ },

/***/ "./node_modules/pkijs/src/CertificationRequest.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js__ = __webpack_require__("./node_modules/asn1js/build/asn1.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_asn1js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pvutils__ = __webpack_require__("./node_modules/pvutils/src/utils.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_js__ = __webpack_require__("./node_modules/pkijs/src/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__PublicKeyInfo_js__ = __webpack_require__("./node_modules/pkijs/src/PublicKeyInfo.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__RelativeDistinguishedNames_js__ = __webpack_require__("./node_modules/pkijs/src/RelativeDistinguishedNames.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__AlgorithmIdentifier_js__ = __webpack_require__("./node_modules/pkijs/src/AlgorithmIdentifier.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__Attribute_js__ = __webpack_require__("./node_modules/pkijs/src/Attribute.js");







//**************************************************************************************
function CertificationRequestInfo(parameters = {})
{
	//CertificationRequestInfo ::= SEQUENCE {
	//    version       INTEGER { v1(0) } (v1,...),
	//    subject       Name,
	//    subjectPKInfo SubjectPublicKeyInfo{{ PKInfoAlgorithms }},
	//    attributes    [0] Attributes{{ CRIAttributes }}
	//}
	
	/**
	 * @type {Object}
	 * @property {string} [blockName]
	 * @property {string} [CertificationRequestInfo]
	 * @property {string} [CertificationRequestInfoVersion]
	 * @property {string} [subject]
	 * @property {string} [CertificationRequestInfoAttributes]
	 * @property {string} [attributes]
	 */
	const names = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "names", {});
	
	return (new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
		name: (names.CertificationRequestInfo || "CertificationRequestInfo"),
		value: [
			new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ name: (names.CertificationRequestInfoVersion || "CertificationRequestInfo.version") }),
			__WEBPACK_IMPORTED_MODULE_4__RelativeDistinguishedNames_js__["a" /* default */].schema(names.subject || {
				names: {
					blockName: "CertificationRequestInfo.subject"
				}
			}),
			__WEBPACK_IMPORTED_MODULE_3__PublicKeyInfo_js__["a" /* default */].schema({
				names: {
					blockName: "CertificationRequestInfo.subjectPublicKeyInfo"
				}
			}),
			new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Constructed"]({
				optional: true,
				idBlock: {
					tagClass: 3, // CONTEXT-SPECIFIC
					tagNumber: 0 // [0]
				},
				value: [
					new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Repeated"]({
						optional: true, // Because OpenSSL makes wrong "attributes" field
						name: (names.CertificationRequestInfoAttributes || "CertificationRequestInfo.attributes"),
						value: __WEBPACK_IMPORTED_MODULE_6__Attribute_js__["a" /* default */].schema(names.attributes || {})
					})
				]
			})
		]
	}));
}
//**************************************************************************************
/**
 * Class from RFC2986
 */
class CertificationRequest
{
	//**********************************************************************************
	/**
	 * Constructor for Attribute class
	 * @param {Object} [parameters={}]
	 * @param {Object} [parameters.schema] asn1js parsed value to initialize the class from
	 */
	constructor(parameters = {})
	{
		//region Internal properties of the object
		/**
		 * @type {ArrayBuffer}
		 * @desc tbs
		 */
		this.tbs = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "tbs", CertificationRequest.defaultValues("tbs"));
		/**
		 * @type {number}
		 * @desc version
		 */
		this.version = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "version", CertificationRequest.defaultValues("version"));
		/**
		 * @type {RelativeDistinguishedNames}
		 * @desc subject
		 */
		this.subject = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "subject", CertificationRequest.defaultValues("subject"));
		/**
		 * @type {PublicKeyInfo}
		 * @desc subjectPublicKeyInfo
		 */
		this.subjectPublicKeyInfo = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "subjectPublicKeyInfo", CertificationRequest.defaultValues("subjectPublicKeyInfo"));
		
		if("attributes" in parameters)
			/**
			 * @type {Array.<Attribute>}
			 * @desc attributes
			 */
			this.attributes = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "attributes", CertificationRequest.defaultValues("attributes"));
		
		/**
		 * @type {AlgorithmIdentifier}
		 * @desc signatureAlgorithm
		 */
		this.signatureAlgorithm = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "signatureAlgorithm", CertificationRequest.defaultValues("signatureAlgorithm"));
		/**
		 * @type {BitString}
		 * @desc signatureAlgorithm
		 */
		this.signatureValue = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "signatureValue", CertificationRequest.defaultValues("signatureValue"));
		//endregion
		
		//region If input argument array contains "schema" for this object
		if("schema" in parameters)
			this.fromSchema(parameters.schema);
		//endregion
	}
	//**********************************************************************************
	/**
	 * Return default values for all class members
	 * @param {string} memberName String name for a class member
	 */
	static defaultValues(memberName)
	{
		switch(memberName)
		{
			case "tbs":
				return new ArrayBuffer(0);
			case "version":
				return 0;
			case "subject":
				return new __WEBPACK_IMPORTED_MODULE_4__RelativeDistinguishedNames_js__["a" /* default */]();
			case "subjectPublicKeyInfo":
				return new __WEBPACK_IMPORTED_MODULE_3__PublicKeyInfo_js__["a" /* default */]();
			case "attributes":
				return [];
			case "signatureAlgorithm":
				return new __WEBPACK_IMPORTED_MODULE_5__AlgorithmIdentifier_js__["a" /* default */]();
			case "signatureValue":
				return new __WEBPACK_IMPORTED_MODULE_0_asn1js__["BitString"]();
			default:
				throw new Error(`Invalid member name for CertificationRequest class: ${memberName}`);
		}
	}
	//**********************************************************************************
	/**
	 * Return value of pre-defined ASN.1 schema for current class
	 *
	 * ASN.1 schema:
	 * ```asn1
	 * CertificationRequest ::= SEQUENCE {
	 *    certificationRequestInfo CertificationRequestInfo,
	 *    signatureAlgorithm       AlgorithmIdentifier{{ SignatureAlgorithms }},
	 *    signature                BIT STRING
	 * }
	 * ```
	 *
	 * @param {Object} parameters Input parameters for the schema
	 * @returns {Object} asn1js schema object
	 */
	static schema(parameters = {})
	{
		/**
		 * @type {Object}
		 * @property {string} [blockName]
		 * @property {string} [certificationRequestInfo]
		 * @property {string} [signatureAlgorithm]
		 * @property {string} [signatureValue]
		 */
		const names = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "names", {});
		
		return (new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
			value: [
				CertificationRequestInfo(names.certificationRequestInfo || {}),
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
					name: (names.signatureAlgorithm || "signatureAlgorithm"),
					value: [
						new __WEBPACK_IMPORTED_MODULE_0_asn1js__["ObjectIdentifier"](),
						new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Any"]({ optional: true })
					]
				}),
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["BitString"]({ name: (names.signatureValue || "signatureValue") })
			]
		}));
	}
	//**********************************************************************************
	/**
	 * Convert parsed asn1js object into current class
	 * @param {!Object} schema
	 */
	fromSchema(schema)
	{
		//region Clear input data first
		__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["clearProps"])(schema, [
			"CertificationRequestInfo",
			"CertificationRequestInfo.version",
			"CertificationRequestInfo.subject",
			"CertificationRequestInfo.subjectPublicKeyInfo",
			"CertificationRequestInfo.attributes",
			"signatureAlgorithm",
			"signatureValue"
		]);
		//endregion
		
		//region Check the schema is valid
		const asn1 = __WEBPACK_IMPORTED_MODULE_0_asn1js__["compareSchema"](schema,
			schema,
			CertificationRequest.schema()
		);
		
		if(asn1.verified === false)
			throw new Error("Object's schema was not verified against input data for CertificationRequest");
		//endregion
		
		//region Get internal properties from parsed schema
		this.tbs = asn1.result.CertificationRequestInfo.valueBeforeDecode;
		
		this.version = asn1.result["CertificationRequestInfo.version"].valueBlock.valueDec;
		this.subject = new __WEBPACK_IMPORTED_MODULE_4__RelativeDistinguishedNames_js__["a" /* default */]({ schema: asn1.result["CertificationRequestInfo.subject"] });
		this.subjectPublicKeyInfo = new __WEBPACK_IMPORTED_MODULE_3__PublicKeyInfo_js__["a" /* default */]({ schema: asn1.result["CertificationRequestInfo.subjectPublicKeyInfo"] });
		if("CertificationRequestInfo.attributes" in asn1.result)
			this.attributes = Array.from(asn1.result["CertificationRequestInfo.attributes"], element => new __WEBPACK_IMPORTED_MODULE_6__Attribute_js__["a" /* default */]({ schema: element }));
		
		this.signatureAlgorithm = new __WEBPACK_IMPORTED_MODULE_5__AlgorithmIdentifier_js__["a" /* default */]({ schema: asn1.result.signatureAlgorithm });
		this.signatureValue = asn1.result.signatureValue;
		//endregion
	}
	//**********************************************************************************
	/**
	 * Aux function making ASN1js Sequence from current TBS
	 * @returns {Sequence}
	 */
	encodeTBS()
	{
		//region Create array for output sequence
		const outputArray = [
			new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ value: this.version }),
			this.subject.toSchema(),
			this.subjectPublicKeyInfo.toSchema()
		];
		
		if("attributes" in this)
		{
			outputArray.push(new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Constructed"]({
				idBlock: {
					tagClass: 3, // CONTEXT-SPECIFIC
					tagNumber: 0 // [0]
				},
				value: Array.from(this.attributes, element => element.toSchema())
			}));
		}
		//endregion
		
		return (new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
			value: outputArray
		}));
	}
	//**********************************************************************************
	/**
	 * Convert current object to asn1js object and set correct values
	 * @returns {Object} asn1js object
	 */
	toSchema(encodeFlag = false)
	{
		//region Decode stored TBS value
		let tbsSchema;
		
		if(encodeFlag === false)
		{
			if(this.tbs.byteLength === 0) // No stored TBS part
				return CertificationRequest.schema();
			
			tbsSchema = __WEBPACK_IMPORTED_MODULE_0_asn1js__["fromBER"](this.tbs).result;
		}
		//endregion
		//region Create TBS schema via assembling from TBS parts
		else
			tbsSchema = this.encodeTBS();
		//endregion
		
		//region Construct and return new ASN.1 schema for this object
		return (new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
			value: [
				tbsSchema,
				this.signatureAlgorithm.toSchema(),
				this.signatureValue
			]
		}));
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convertion for the class to JSON object
	 * @returns {Object}
	 */
	toJSON()
	{
		const object = {
			tbs: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["bufferToHexCodes"])(this.tbs, 0, this.tbs.byteLength),
			version: this.version,
			subject: this.subject.toJSON(),
			subjectPublicKeyInfo: this.subjectPublicKeyInfo.toJSON(),
			signatureAlgorithm: this.signatureAlgorithm.toJSON(),
			signatureValue: this.signatureValue.toJSON()
		};
		
		if("attributes" in this)
			object.attributes = Array.from(this.attributes, element => element.toJSON());
		
		return object;
	}
	//**********************************************************************************
	/**
	 * Makes signature for currect certification request
	 * @param {Object} privateKey WebCrypto private key
	 * @param {string} [hashAlgorithm=SHA-1] String representing current hashing algorithm
	 */
	sign(privateKey, hashAlgorithm = "SHA-1")
	{
		//region Initial checking
		//region Get a private key from function parameter
		if(typeof privateKey === "undefined")
			return Promise.reject("Need to provide a private key for signing");
		//endregion
		//endregion
		
		//region Initial variables
		let sequence = Promise.resolve();
		let parameters;
		
		const engine = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__common_js__["e" /* getEngine */])();
		//endregion
		
		//region Get a "default parameters" for current algorithm and set correct signature algorithm
		sequence = sequence.then(() => engine.subtle.getSignatureParameters(privateKey, hashAlgorithm));
		
		sequence = sequence.then(result =>
		{
			parameters = result.parameters;
			this.signatureAlgorithm = result.signatureAlgorithm;
		});
		//endregion
		
		//region Create TBS data for signing
		sequence = sequence.then(() =>
		{
			this.tbs = this.encodeTBS().toBER(false);
		});
		//endregion
		
		//region Signing TBS data on provided private key
		sequence = sequence.then(() => engine.subtle.signWithPrivateKey(this.tbs, privateKey, parameters));
		
		sequence = sequence.then(result =>
		{
			this.signatureValue = new __WEBPACK_IMPORTED_MODULE_0_asn1js__["BitString"]({ valueHex: result });
		});
		//endregion
		
		return sequence;
	}
	//**********************************************************************************
	/**
	 * Verify existing certification request signature
	 * @returns {*}
	 */
	verify()
	{
		return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__common_js__["e" /* getEngine */])().subtle.verifyWithPublicKey(this.tbs, this.signatureValue, this.subjectPublicKeyInfo, this.signatureAlgorithm);
	}
	//**********************************************************************************
	/**
	 * Importing public key for current certificate request
	 */
	getPublicKey(parameters = null)
	{
		return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__common_js__["e" /* getEngine */])().getPublicKey(this.subjectPublicKeyInfo, this.signatureAlgorithm, parameters);
	}
	//**********************************************************************************
}/* harmony export */ exports["default"] = CertificationRequest;
//**************************************************************************************


/***/ },

/***/ "./node_modules/pkijs/src/CryptoEngine.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js__ = __webpack_require__("./node_modules/asn1js/build/asn1.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_asn1js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pvutils__ = __webpack_require__("./node_modules/pvutils/src/utils.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_js__ = __webpack_require__("./node_modules/pkijs/src/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__PublicKeyInfo_js__ = __webpack_require__("./node_modules/pkijs/src/PublicKeyInfo.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__PrivateKeyInfo_js__ = __webpack_require__("./node_modules/pkijs/src/PrivateKeyInfo.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__AlgorithmIdentifier_js__ = __webpack_require__("./node_modules/pkijs/src/AlgorithmIdentifier.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__EncryptedContentInfo_js__ = __webpack_require__("./node_modules/pkijs/src/EncryptedContentInfo.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__RSASSAPSSParams_js__ = __webpack_require__("./node_modules/pkijs/src/RSASSAPSSParams.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__PBKDF2Params_js__ = __webpack_require__("./node_modules/pkijs/src/PBKDF2Params.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__PBES2Params_js__ = __webpack_require__("./node_modules/pkijs/src/PBES2Params.js");










//**************************************************************************************
/**
 * Making MAC key using algorithm described in B.2 of PKCS#12 standard.
 */
function makePKCS12B2Key(cryptoEngine, hashAlgorithm, keyLength, password, salt, iterationCount)
{
	//region Initial variables
	let u;
	let v;
	
	const result = [];
	//endregion
	
	//region Get "u" and "v" values
	switch(hashAlgorithm.toUpperCase())
	{
		case "SHA-1":
			u = 20; // 160
			v = 64; // 512
			break;
		case "SHA-256":
			u = 32; // 256
			v = 64; // 512
			break;
		case "SHA-384":
			u = 48; // 384
			v = 128; // 1024
			break;
		case "SHA-512":
			u = 64; // 512
			v = 128; // 1024
			break;
		default:
			throw new Error("Unsupported hashing algorithm");
	}
	//endregion
	
	//region Main algorithm making key
	//region Transform password to UTF-8 like string
	const passwordViewInitial = new Uint8Array(password);
	
	const passwordTransformed = new ArrayBuffer((password.byteLength * 2) + 2);
	const passwordTransformedView = new Uint8Array(passwordTransformed);
	
	for(let i = 0; i < passwordViewInitial.length; i++)
	{
		passwordTransformedView[i * 2] = 0x00;
		passwordTransformedView[i * 2 + 1] = passwordViewInitial[i];
	}
	
	passwordTransformedView[passwordTransformedView.length - 2] = 0x00;
	passwordTransformedView[passwordTransformedView.length - 1] = 0x00;
	
	password = passwordTransformed.slice(0);
	//endregion
	
	//region Construct a string D (the "diversifier") by concatenating v/8 copies of ID
	const D = new ArrayBuffer(v);
	const dView = new Uint8Array(D);
	
	for(let i = 0; i < D.byteLength; i++)
		dView[i] = 3; // The ID value equal to "3" for MACing (see B.3 of standard)
	//endregion
	
	//region Concatenate copies of the salt together to create a string S of length v * ceil(s / v) bytes (the final copy of the salt may be trunacted to create S)
	const saltLength = salt.byteLength;
	
	const sLen = v * Math.ceil(saltLength / v);
	const S = new ArrayBuffer(sLen);
	const sView = new Uint8Array(S);
	
	const saltView = new Uint8Array(salt);
	
	for(let i = 0; i < sLen; i++)
		sView[i] = saltView[i % saltLength];
	//endregion
	
	//region Concatenate copies of the password together to create a string P of length v * ceil(p / v) bytes (the final copy of the password may be truncated to create P)
	const passwordLength = password.byteLength;
	
	const pLen = v * Math.ceil(passwordLength / v);
	const P = new ArrayBuffer(pLen);
	const pView = new Uint8Array(P);
	
	const passwordView = new Uint8Array(password);
	
	for(let i = 0; i < pLen; i++)
		pView[i] = passwordView[i % passwordLength];
	//endregion
	
	//region Set I=S||P to be the concatenation of S and P
	const sPlusPLength = S.byteLength + P.byteLength;
	
	let I = new ArrayBuffer(sPlusPLength);
	let iView = new Uint8Array(I);
	
	iView.set(sView);
	iView.set(pView, sView.length);
	//endregion
	
	//region Set c=ceil(n / u)
	const c = Math.ceil((keyLength >> 3) / u);
	//endregion
	
	//region Initial variables
	let internalSequence = Promise.resolve(I);
	//endregion
	
	//region For i=1, 2, ..., c, do the following:
	for(let i = 0; i <= c; i++)
	{
		internalSequence = internalSequence.then(_I =>
		{
			//region Create contecanetion of D and I
			const dAndI = new ArrayBuffer(D.byteLength + _I.byteLength);
			const dAndIView = new Uint8Array(dAndI);
			
			dAndIView.set(dView);
			dAndIView.set(iView, dView.length);
			//endregion
			
			return dAndI;
		});
		
		//region Make "iterationCount" rounds of hashing
		for(let j = 0; j < iterationCount; j++)
			internalSequence = internalSequence.then(roundBuffer => cryptoEngine.digest({ name: hashAlgorithm }, new Uint8Array(roundBuffer)));
		//endregion
		
		internalSequence = internalSequence.then(roundBuffer =>
		{
			//region Concatenate copies of Ai to create a string B of length v bits (the final copy of Ai may be truncated to create B)
			const B = new ArrayBuffer(v);
			const bView = new Uint8Array(B);
			
			for(let j = 0; j < B.byteLength; j++)
				bView[j] = roundBuffer[j % roundBuffer.length];
			//endregion
			
			//region Make new I value
			const k = Math.ceil(saltLength / v) + Math.ceil(passwordLength / v);
			const iRound = [];
			
			let sliceStart = 0;
			let sliceLength = v;
			
			for(let j = 0; j < k; j++)
			{
				const chunk = Array.from(new Uint8Array(I.slice(sliceStart, sliceStart + sliceLength)));
				sliceStart += v;
				if((sliceStart + v) > I.byteLength)
					sliceLength = I.byteLength - sliceStart;
				
				let x = 0x1ff;
				
				for(let l = (B.byteLength - 1); l >= 0; l--)
				{
					x >>= 8;
					x += bView[l] + chunk[l];
					chunk[l] = (x & 0xff);
				}
				
				iRound.push(...chunk);
			}
			
			I = new ArrayBuffer(iRound.length);
			iView = new Uint8Array(I);
			
			iView.set(iRound);
			//endregion
			
			result.push(...(new Uint8Array(roundBuffer)));
			
			return I;
		});
	}
	//endregion
	
	//region Initialize final key
	internalSequence = internalSequence.then(() =>
	{
		const resultBuffer = new ArrayBuffer(keyLength >> 3);
		const resultView = new Uint8Array(resultBuffer);
		
		resultView.set((new Uint8Array(result)).slice(0, keyLength >> 3));
		
		return resultBuffer;
	});
	//endregion
	//endregion
	
	return internalSequence;
}
//**************************************************************************************
/**
 * Default cryptographic engine for Web Cryptography API
 */
class CryptoEngine
{
	//**********************************************************************************
	/**
	 * Constructor for CryptoEngine class
	 * @param {Object} [parameters={}]
	 * @param {Object} [parameters.schema] asn1js parsed value to initialize the class from
	 */
	constructor(parameters = {})
	{
		//region Internal properties of the object
		/**
		 * @type {Object}
		 * @desc Usually here we are expecting "window.crypto" or an equivalent from custom "crypto engine"
		 */
		this.crypto = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "crypto", {});
		/**
		 * @type {Object}
		 * @desc Usually here we are expecting "window.crypto.subtle" or an equivalent from custom "crypto engine"
		 */
		this.subtle = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "subtle", {});
		/**
		 * @type {string}
		 * @desc Name of the "crypto engine"
		 */
		this.name = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "name", "");
		//endregion
	}
	//**********************************************************************************
	/**
	 * Import WebCrypto keys from different formats
	 * @param {string} format
	 * @param {ArrayBuffer|Uint8Array} keyData
	 * @param {Object} algorithm
	 * @param {boolean} extractable
	 * @param {Array} keyUsages
	 * @returns {Promise}
	 */
	importKey(format, keyData, algorithm, extractable, keyUsages)
	{
		//region Initial variables
		let jwk = {};
		//endregion
		
		//region Change "keyData" type if needed
		if(keyData instanceof Uint8Array)
			keyData = keyData.buffer;
		//endregion
		
		switch(format.toLowerCase())
		{
			case "raw":
				return this.subtle.importKey("raw", keyData, algorithm, extractable, keyUsages);
			case "spki":
				{
					const asn1 = __WEBPACK_IMPORTED_MODULE_0_asn1js__["fromBER"](keyData);
					if(asn1.offset === (-1))
						return Promise.reject("Incorrect keyData");

					const publicKeyInfo = new __WEBPACK_IMPORTED_MODULE_3__PublicKeyInfo_js__["a" /* default */]();
					try
					{
						publicKeyInfo.fromSchema(asn1.result);
					}
					catch(ex)
					{
						return Promise.reject("Incorrect keyData");
					}


					// noinspection FallThroughInSwitchStatementJS
					switch(algorithm.name.toUpperCase())
					{
						case "RSA-PSS":
							{
								//region Get information about used hash function
								switch(algorithm.hash.name.toUpperCase())
								{
									case "SHA-1":
										jwk.alg = "PS1";
										break;
									case "SHA-256":
										jwk.alg = "PS256";
										break;
									case "SHA-384":
										jwk.alg = "PS384";
										break;
									case "SHA-512":
										jwk.alg = "PS512";
										break;
									default:
										return Promise.reject(`Incorrect hash algorithm: ${algorithm.hash.name.toUpperCase()}`);
								}
								//endregion
							}
							// break omitted
						case "RSASSA-PKCS1-V1_5":
							{
								keyUsages = ["verify"]; // Override existing keyUsages value since the key is a public key

								jwk.kty = "RSA";
								jwk.ext = extractable;
								jwk.key_ops = keyUsages;

								if(publicKeyInfo.algorithm.algorithmId !== "1.2.840.113549.1.1.1")
									return Promise.reject(`Incorrect public key algorithm: ${publicKeyInfo.algorithm.algorithmId}`);

								//region Get information about used hash function
								if(("alg" in jwk) === false)
								{
									switch(algorithm.hash.name.toUpperCase())
									{
										case "SHA-1":
											jwk.alg = "RS1";
											break;
										case "SHA-256":
											jwk.alg = "RS256";
											break;
										case "SHA-384":
											jwk.alg = "RS384";
											break;
										case "SHA-512":
											jwk.alg = "RS512";
											break;
										default:
											return Promise.reject(`Incorrect hash algorithm: ${algorithm.hash.name.toUpperCase()}`);
									}
								}
								//endregion

								//region Create RSA Public Key elements
								const publicKeyJSON = publicKeyInfo.toJSON();

								for(const key of Object.keys(publicKeyJSON))
									jwk[key] = publicKeyJSON[key];
								//endregion
							}
							break;
						case "ECDSA":
							keyUsages = ["verify"]; // Override existing keyUsages value since the key is a public key
							// break omitted
						case "ECDH":
							{
								//region Initial variables
								jwk = {
									kty: "EC",
									ext: extractable,
									key_ops: keyUsages
								};
								//endregion

								//region Get information about algorithm
								if(publicKeyInfo.algorithm.algorithmId !== "1.2.840.10045.2.1")
									return Promise.reject(`Incorrect public key algorithm: ${publicKeyInfo.algorithm.algorithmId}`);
								//endregion

								//region Create ECDSA Public Key elements
								const publicKeyJSON = publicKeyInfo.toJSON();

								for(const key of Object.keys(publicKeyJSON))
									jwk[key] = publicKeyJSON[key];
								//endregion
							}
							break;
						case "RSA-OAEP":
							{
								jwk.kty = "RSA";
								jwk.ext = extractable;
								jwk.key_ops = keyUsages;
								
								if(this.name.toLowerCase() === "safari")
									jwk.alg = "RSA-OAEP";
								else
								{
									switch(algorithm.hash.name.toUpperCase())
									{
										case "SHA-1":
											jwk.alg = "RSA-OAEP";
											break;
										case "SHA-256":
											jwk.alg = "RSA-OAEP-256";
											break;
										case "SHA-384":
											jwk.alg = "RSA-OAEP-384";
											break;
										case "SHA-512":
											jwk.alg = "RSA-OAEP-512";
											break;
										default:
											return Promise.reject(`Incorrect hash algorithm: ${algorithm.hash.name.toUpperCase()}`);
									}
								}
								
								//region Create ECDSA Public Key elements
								const publicKeyJSON = publicKeyInfo.toJSON();
								
								for(const key of Object.keys(publicKeyJSON))
									jwk[key] = publicKeyJSON[key];
								//endregion
							}
							break;
						case "RSAES-PKCS1-V1_5":
							{
								jwk.kty = "RSA";
								jwk.ext = extractable;
								jwk.key_ops = keyUsages;
								jwk.alg = "PS1";

								const publicKeyJSON = publicKeyInfo.toJSON();

								for(const key of Object.keys(publicKeyJSON))
									jwk[key] = publicKeyJSON[key];
							}
							break;
						default:
							return Promise.reject(`Incorrect algorithm name: ${algorithm.name.toUpperCase()}`);
					}
				}
				break;
			case "pkcs8":
				{
					const privateKeyInfo = new __WEBPACK_IMPORTED_MODULE_4__PrivateKeyInfo_js__["a" /* default */]();

					//region Parse "PrivateKeyInfo" object
					const asn1 = __WEBPACK_IMPORTED_MODULE_0_asn1js__["fromBER"](keyData);
					if(asn1.offset === (-1))
						return Promise.reject("Incorrect keyData");

					try
					{
						privateKeyInfo.fromSchema(asn1.result);
					}
					catch(ex)
					{
						return Promise.reject("Incorrect keyData");
					}
					
					if(("parsedKey" in privateKeyInfo) === false)
						return Promise.reject("Incorrect keyData");
					//endregion

					// noinspection FallThroughInSwitchStatementJS
					// noinspection FallThroughInSwitchStatementJS
					switch(algorithm.name.toUpperCase())
					{
						case "RSA-PSS":
							{
								//region Get information about used hash function
								switch(algorithm.hash.name.toUpperCase())
								{
									case "SHA-1":
										jwk.alg = "PS1";
										break;
									case "SHA-256":
										jwk.alg = "PS256";
										break;
									case "SHA-384":
										jwk.alg = "PS384";
										break;
									case "SHA-512":
										jwk.alg = "PS512";
										break;
									default:
										return Promise.reject(`Incorrect hash algorithm: ${algorithm.hash.name.toUpperCase()}`);
								}
								//endregion
							}
							// break omitted
						case "RSASSA-PKCS1-V1_5":
							{
								keyUsages = ["sign"]; // Override existing keyUsages value since the key is a private key

								jwk.kty = "RSA";
								jwk.ext = extractable;
								jwk.key_ops = keyUsages;

								//region Get information about used hash function
								if(privateKeyInfo.privateKeyAlgorithm.algorithmId !== "1.2.840.113549.1.1.1")
									return Promise.reject(`Incorrect private key algorithm: ${privateKeyInfo.privateKeyAlgorithm.algorithmId}`);
								//endregion

								//region Get information about used hash function
								if(("alg" in jwk) === false)
								{
									switch(algorithm.hash.name.toUpperCase())
									{
										case "SHA-1":
											jwk.alg = "RS1";
											break;
										case "SHA-256":
											jwk.alg = "RS256";
											break;
										case "SHA-384":
											jwk.alg = "RS384";
											break;
										case "SHA-512":
											jwk.alg = "RS512";
											break;
										default:
											return Promise.reject(`Incorrect hash algorithm: ${algorithm.hash.name.toUpperCase()}`);
									}
								}
								//endregion

								//region Create RSA Private Key elements
								const privateKeyJSON = privateKeyInfo.toJSON();

								for(const key of Object.keys(privateKeyJSON))
									jwk[key] = privateKeyJSON[key];
								//endregion
							}
							break;
						case "ECDSA":
							keyUsages = ["sign"]; // Override existing keyUsages value since the key is a private key
							// break omitted
						case "ECDH":
							{
								//region Initial variables
								jwk = {
									kty: "EC",
									ext: extractable,
									key_ops: keyUsages
								};
								//endregion

								//region Get information about used hash function
								if(privateKeyInfo.privateKeyAlgorithm.algorithmId !== "1.2.840.10045.2.1")
									return Promise.reject(`Incorrect algorithm: ${privateKeyInfo.privateKeyAlgorithm.algorithmId}`);
								//endregion

								//region Create ECDSA Private Key elements
								const privateKeyJSON = privateKeyInfo.toJSON();

								for(const key of Object.keys(privateKeyJSON))
									jwk[key] = privateKeyJSON[key];
								//endregion
							}
							break;
						case "RSA-OAEP":
							{
								jwk.kty = "RSA";
								jwk.ext = extractable;
								jwk.key_ops = keyUsages;
								
								//region Get information about used hash function
								if(this.name.toLowerCase() === "safari")
									jwk.alg = "RSA-OAEP";
								else
								{
									switch(algorithm.hash.name.toUpperCase())
									{
										case "SHA-1":
											jwk.alg = "RSA-OAEP";
											break;
										case "SHA-256":
											jwk.alg = "RSA-OAEP-256";
											break;
										case "SHA-384":
											jwk.alg = "RSA-OAEP-384";
											break;
										case "SHA-512":
											jwk.alg = "RSA-OAEP-512";
											break;
										default:
											return Promise.reject(`Incorrect hash algorithm: ${algorithm.hash.name.toUpperCase()}`);
									}
								}
								//endregion
								
								//region Create RSA Private Key elements
								const privateKeyJSON = privateKeyInfo.toJSON();
								
								for(const key of Object.keys(privateKeyJSON))
									jwk[key] = privateKeyJSON[key];
								//endregion
							}
							break;
						case "RSAES-PKCS1-V1_5":
							{
								keyUsages = ["decrypt"]; // Override existing keyUsages value since the key is a private key

								jwk.kty = "RSA";
								jwk.ext = extractable;
								jwk.key_ops = keyUsages;
								jwk.alg = "PS1";

								//region Create RSA Private Key elements
								const privateKeyJSON = privateKeyInfo.toJSON();

								for(const key of Object.keys(privateKeyJSON))
									jwk[key] = privateKeyJSON[key];
								//endregion
							}
							break;
						default:
							return Promise.reject(`Incorrect algorithm name: ${algorithm.name.toUpperCase()}`);
					}
				}
				break;
			case "jwk":
				jwk = keyData;
				break;
			default:
				return Promise.reject(`Incorrect format: ${format}`);
		}
		
		//region Special case for Safari browser (since its acting not as WebCrypto standard describes)
		if(this.name.toLowerCase() === "safari")
		{
			// Try to use both ways - import using ArrayBuffer and pure JWK (for Safari Technology Preview)
			return Promise.resolve().then(() => this.subtle.importKey("jwk", __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["stringToArrayBuffer"])(JSON.stringify(jwk)), algorithm, extractable, keyUsages))
				.then(result => result, () => this.subtle.importKey("jwk", jwk, algorithm, extractable, keyUsages));
		}
		//endregion
		
		return this.subtle.importKey("jwk", jwk, algorithm, extractable, keyUsages);
	}
	//**********************************************************************************
	/**
	 * Export WebCrypto keys to different formats
	 * @param {string} format
	 * @param {Object} key
	 * @returns {Promise}
	 */
	exportKey(format, key)
	{
		let sequence = this.subtle.exportKey("jwk", key);
		
		//region Currently Safari returns ArrayBuffer as JWK thus we need an additional transformation
		if(this.name.toLowerCase() === "safari")
		{
			sequence = sequence.then(result =>
			{
				// Some additional checks for Safari Technology Preview
				if(result instanceof ArrayBuffer)
					return JSON.parse(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["arrayBufferToString"])(result));
				
				return result;
			});
		}
		//endregion
		
		switch(format.toLowerCase())
		{
			case "raw":
				return this.subtle.exportKey("raw", key);
			case "spki":
				sequence = sequence.then(result =>
				{
					const publicKeyInfo = new __WEBPACK_IMPORTED_MODULE_3__PublicKeyInfo_js__["a" /* default */]();

					try
					{
						publicKeyInfo.fromJSON(result);
					}
					catch(ex)
					{
						return Promise.reject("Incorrect key data");
					}

					return publicKeyInfo.toSchema().toBER(false);
				});
				break;
			case "pkcs8":
				sequence = sequence.then(result =>
				{
					const privateKeyInfo = new __WEBPACK_IMPORTED_MODULE_4__PrivateKeyInfo_js__["a" /* default */]();

					try
					{
						privateKeyInfo.fromJSON(result);
					}
					catch(ex)
					{
						return Promise.reject("Incorrect key data");
					}

					return privateKeyInfo.toSchema().toBER(false);
				});
				break;
			case "jwk":
				break;
			default:
				return Promise.reject(`Incorrect format: ${format}`);
		}

		return sequence;
	}
	//**********************************************************************************
	/**
	 * Convert WebCrypto keys between different export formats
	 * @param {string} inputFormat
	 * @param {string} outputFormat
	 * @param {ArrayBuffer|Object} keyData
	 * @param {Object} algorithm
	 * @param {boolean} extractable
	 * @param {Array} keyUsages
	 * @returns {Promise}
	 */
	convert(inputFormat, outputFormat, keyData, algorithm, extractable, keyUsages)
	{
		switch(inputFormat.toLowerCase())
		{
			case "raw":
				switch(outputFormat.toLowerCase())
				{
					case "raw":
						return Promise.resolve(keyData);
					case "spki":
						return Promise.resolve()
							.then(() => this.importKey("raw", keyData, algorithm, extractable, keyUsages))
							.then(result => this.exportKey("spki", result));
					case "pkcs8":
						return Promise.resolve()
							.then(() => this.importKey("raw", keyData, algorithm, extractable, keyUsages))
							.then(result => this.exportKey("pkcs8", result));
					case "jwk":
						return Promise.resolve()
							.then(() => this.importKey("raw", keyData, algorithm, extractable, keyUsages))
							.then(result => this.exportKey("jwk", result));
					default:
						return Promise.reject(`Incorrect outputFormat: ${outputFormat}`);
				}
			case "spki":
				switch(outputFormat.toLowerCase())
				{
					case "raw":
						return Promise.resolve()
							.then(() => this.importKey("spki", keyData, algorithm, extractable, keyUsages))
							.then(result => this.exportKey("raw", result));
					case "spki":
						return Promise.resolve(keyData);
					case "pkcs8":
						return Promise.reject("Impossible to convert between SPKI/PKCS8");
					case "jwk":
						return Promise.resolve()
							.then(() => this.importKey("spki", keyData, algorithm, extractable, keyUsages))
							.then(result => this.exportKey("jwk", result));
					default:
						return Promise.reject(`Incorrect outputFormat: ${outputFormat}`);
				}
			case "pkcs8":
				switch(outputFormat.toLowerCase())
				{
					case "raw":
						return Promise.resolve()
							.then(() => this.importKey("pkcs8", keyData, algorithm, extractable, keyUsages))
							.then(result => this.exportKey("raw", result));
					case "spki":
						return Promise.reject("Impossible to convert between SPKI/PKCS8");
					case "pkcs8":
						return Promise.resolve(keyData);
					case "jwk":
						return Promise.resolve()
							.then(() => this.importKey("pkcs8", keyData, algorithm, extractable, keyUsages))
							.then(result => this.exportKey("jwk", result));
					default:
						return Promise.reject(`Incorrect outputFormat: ${outputFormat}`);
				}
			case "jwk":
				switch(outputFormat.toLowerCase())
				{
					case "raw":
						return Promise.resolve()
							.then(() => this.importKey("jwk", keyData, algorithm, extractable, keyUsages))
							.then(result => this.exportKey("raw", result));
					case "spki":
						return Promise.resolve()
							.then(() => this.importKey("jwk", keyData, algorithm, extractable, keyUsages))
							.then(result => this.exportKey("spki", result));
					case "pkcs8":
						return Promise.resolve()
							.then(() => this.importKey("jwk", keyData, algorithm, extractable, keyUsages))
							.then(result => this.exportKey("pkcs8", result));
					case "jwk":
						return Promise.resolve(keyData);
					default:
						return Promise.reject(`Incorrect outputFormat: ${outputFormat}`);
				}
			default:
				return Promise.reject(`Incorrect inputFormat: ${inputFormat}`);
		}
	}
	//**********************************************************************************
	/**
	 * Wrapper for standard function "encrypt"
	 * @param args
	 * @returns {Promise}
	 */
	encrypt(...args)
	{
		return this.subtle.encrypt(...args);
	}
	//**********************************************************************************
	/**
	 * Wrapper for standard function "decrypt"
	 * @param args
	 * @returns {Promise}
	 */
	decrypt(...args)
	{
		return this.subtle.decrypt(...args);
	}
	//**********************************************************************************
	/**
	 * Wrapper for standard function "sign"
	 * @param args
	 * @returns {Promise}
	 */
	sign(...args)
	{
		return this.subtle.sign(...args);
	}
	//**********************************************************************************
	/**
	 * Wrapper for standard function "verify"
	 * @param args
	 * @returns {Promise}
	 */
	verify(...args)
	{
		return this.subtle.verify(...args);
	}
	//**********************************************************************************
	/**
	 * Wrapper for standard function "digest"
	 * @param args
	 * @returns {Promise}
	 */
	digest(...args)
	{
		return this.subtle.digest(...args);
	}
	//**********************************************************************************
	/**
	 * Wrapper for standard function "generateKey"
	 * @param args
	 * @returns {Promise}
	 */
	generateKey(...args)
	{
		return this.subtle.generateKey(...args);
	}
	//**********************************************************************************
	/**
	 * Wrapper for standard function "deriveKey"
	 * @param args
	 * @returns {Promise}
	 */
	deriveKey(...args)
	{
		return this.subtle.deriveKey(...args);
	}
	//**********************************************************************************
	/**
	 * Wrapper for standard function "deriveBits"
	 * @param args
	 * @returns {Promise}
	 */
	deriveBits(...args)
	{
		return this.subtle.deriveBits(...args);
	}
	//**********************************************************************************
	/**
	 * Wrapper for standard function "wrapKey"
	 * @param args
	 * @returns {Promise}
	 */
	wrapKey(...args)
	{
		return this.subtle.wrapKey(...args);
	}
	//**********************************************************************************
	/**
	 * Wrapper for standard function "unwrapKey"
	 * @param args
	 * @returns {Promise}
	 */
	unwrapKey(...args)
	{
		return this.subtle.unwrapKey(...args);
	}
	//**********************************************************************************
	/**
	 * Initialize input Uint8Array by random values (with help from current "crypto engine")
	 * @param {!Uint8Array} view
	 * @returns {*}
	 */
	getRandomValues(view)
	{
		if(("getRandomValues" in this.crypto) === false)
			throw new Error("No support for getRandomValues");
		
		return this.crypto.getRandomValues(view);
	}
	//**********************************************************************************
	/**
	 * Get WebCrypto algorithm by wel-known OID
	 * @param {string} oid well-known OID to search for
	 * @returns {Object}
	 */
	getAlgorithmByOID(oid)
	{
		switch(oid)
		{
			case "1.2.840.113549.1.1.1":
				return {
					name: "RSAES-PKCS1-v1_5"
				};
			case "1.2.840.113549.1.1.5":
				return {
					name: "RSASSA-PKCS1-v1_5",
					hash: {
						name: "SHA-1"
					}
				};
			case "1.2.840.113549.1.1.11":
				return {
					name: "RSASSA-PKCS1-v1_5",
					hash: {
						name: "SHA-256"
					}
				};
			case "1.2.840.113549.1.1.12":
				return {
					name: "RSASSA-PKCS1-v1_5",
					hash: {
						name: "SHA-384"
					}
				};
			case "1.2.840.113549.1.1.13":
				return {
					name: "RSASSA-PKCS1-v1_5",
					hash: {
						name: "SHA-512"
					}
				};
			case "1.2.840.113549.1.1.10":
				return {
					name: "RSA-PSS"
				};
			case "1.2.840.113549.1.1.7":
				return {
					name: "RSA-OAEP"
				};
			case "1.2.840.10045.2.1":
			case "1.2.840.10045.4.1":
				return {
					name: "ECDSA",
					hash: {
						name: "SHA-1"
					}
				};
			case "1.2.840.10045.4.3.2":
				return {
					name: "ECDSA",
					hash: {
						name: "SHA-256"
					}
				};
			case "1.2.840.10045.4.3.3":
				return {
					name: "ECDSA",
					hash: {
						name: "SHA-384"
					}
				};
			case "1.2.840.10045.4.3.4":
				return {
					name: "ECDSA",
					hash: {
						name: "SHA-512"
					}
				};
			case "1.3.133.16.840.63.0.2":
				return {
					name: "ECDH",
					kdf: "SHA-1"
				};
			case "1.3.132.1.11.1":
				return {
					name: "ECDH",
					kdf: "SHA-256"
				};
			case "1.3.132.1.11.2":
				return {
					name: "ECDH",
					kdf: "SHA-384"
				};
			case "1.3.132.1.11.3":
				return {
					name: "ECDH",
					kdf: "SHA-512"
				};
			case "2.16.840.1.101.3.4.1.2":
				return {
					name: "AES-CBC",
					length: 128
				};
			case "2.16.840.1.101.3.4.1.22":
				return {
					name: "AES-CBC",
					length: 192
				};
			case "2.16.840.1.101.3.4.1.42":
				return {
					name: "AES-CBC",
					length: 256
				};
			case "2.16.840.1.101.3.4.1.6":
				return {
					name: "AES-GCM",
					length: 128
				};
			case "2.16.840.1.101.3.4.1.26":
				return {
					name: "AES-GCM",
					length: 192
				};
			case "2.16.840.1.101.3.4.1.46":
				return {
					name: "AES-GCM",
					length: 256
				};
			case "2.16.840.1.101.3.4.1.4":
				return {
					name: "AES-CFB",
					length: 128
				};
			case "2.16.840.1.101.3.4.1.24":
				return {
					name: "AES-CFB",
					length: 192
				};
			case "2.16.840.1.101.3.4.1.44":
				return {
					name: "AES-CFB",
					length: 256
				};
			case "2.16.840.1.101.3.4.1.5":
				return {
					name: "AES-KW",
					length: 128
				};
			case "2.16.840.1.101.3.4.1.25":
				return {
					name: "AES-KW",
					length: 192
				};
			case "2.16.840.1.101.3.4.1.45":
				return {
					name: "AES-KW",
					length: 256
				};
			case "1.2.840.113549.2.7":
				return {
					name: "HMAC",
					hash: {
						name: "SHA-1"
					}
				};
			case "1.2.840.113549.2.9":
				return {
					name: "HMAC",
					hash: {
						name: "SHA-256"
					}
				};
			case "1.2.840.113549.2.10":
				return {
					name: "HMAC",
					hash: {
						name: "SHA-384"
					}
				};
			case "1.2.840.113549.2.11":
				return {
					name: "HMAC",
					hash: {
						name: "SHA-512"
					}
				};
			case "1.2.840.113549.1.9.16.3.5":
				return {
					name: "DH"
				};
			case "1.3.14.3.2.26":
				return {
					name: "SHA-1"
				};
			case "2.16.840.1.101.3.4.2.1":
				return {
					name: "SHA-256"
				};
			case "2.16.840.1.101.3.4.2.2":
				return {
					name: "SHA-384"
				};
			case "2.16.840.1.101.3.4.2.3":
				return {
					name: "SHA-512"
				};
			case "1.2.840.113549.1.5.12":
				return {
					name: "PBKDF2"
				};
			//region Special case - OIDs for ECC curves
			case "1.2.840.10045.3.1.7":
				return {
					name: "P-256"
				};
			case "1.3.132.0.34":
				return {
					name: "P-384"
				};
			case "1.3.132.0.35":
				return {
					name: "P-521"
				};
			//endregion
			default:
		}
		
		return {};
	}
	//**********************************************************************************
	/**
	 * Get OID for each specific algorithm
	 * @param {Object} algorithm
	 * @returns {string}
	 */
	getOIDByAlgorithm(algorithm)
	{
		let result = "";
		
		switch(algorithm.name.toUpperCase())
		{
			case "RSAES-PKCS1-V1_5":
				result = "1.2.840.113549.1.1.1";
				break;
			case "RSASSA-PKCS1-V1_5":
				switch(algorithm.hash.name.toUpperCase())
				{
					case "SHA-1":
						result = "1.2.840.113549.1.1.5";
						break;
					case "SHA-256":
						result = "1.2.840.113549.1.1.11";
						break;
					case "SHA-384":
						result = "1.2.840.113549.1.1.12";
						break;
					case "SHA-512":
						result = "1.2.840.113549.1.1.13";
						break;
					default:
				}
				break;
			case "RSA-PSS":
				result = "1.2.840.113549.1.1.10";
				break;
			case "RSA-OAEP":
				result = "1.2.840.113549.1.1.7";
				break;
			case "ECDSA":
				switch(algorithm.hash.name.toUpperCase())
				{
					case "SHA-1":
						result = "1.2.840.10045.4.1";
						break;
					case "SHA-256":
						result = "1.2.840.10045.4.3.2";
						break;
					case "SHA-384":
						result = "1.2.840.10045.4.3.3";
						break;
					case "SHA-512":
						result = "1.2.840.10045.4.3.4";
						break;
					default:
				}
				break;
			case "ECDH":
				switch(algorithm.kdf.toUpperCase()) // Non-standard addition - hash algorithm of KDF function
				{
					case "SHA-1":
						result = "1.3.133.16.840.63.0.2"; // dhSinglePass-stdDH-sha1kdf-scheme
						break;
					case "SHA-256":
						result = "1.3.132.1.11.1"; // dhSinglePass-stdDH-sha256kdf-scheme
						break;
					case "SHA-384":
						result = "1.3.132.1.11.2"; // dhSinglePass-stdDH-sha384kdf-scheme
						break;
					case "SHA-512":
						result = "1.3.132.1.11.3"; // dhSinglePass-stdDH-sha512kdf-scheme
						break;
					default:
				}
				break;
			case "AES-CTR":
				break;
			case "AES-CBC":
				switch(algorithm.length)
				{
					case 128:
						result = "2.16.840.1.101.3.4.1.2";
						break;
					case 192:
						result = "2.16.840.1.101.3.4.1.22";
						break;
					case 256:
						result = "2.16.840.1.101.3.4.1.42";
						break;
					default:
				}
				break;
			case "AES-CMAC":
				break;
			case "AES-GCM":
				switch(algorithm.length)
				{
					case 128:
						result = "2.16.840.1.101.3.4.1.6";
						break;
					case 192:
						result = "2.16.840.1.101.3.4.1.26";
						break;
					case 256:
						result = "2.16.840.1.101.3.4.1.46";
						break;
					default:
				}
				break;
			case "AES-CFB":
				switch(algorithm.length)
				{
					case 128:
						result = "2.16.840.1.101.3.4.1.4";
						break;
					case 192:
						result = "2.16.840.1.101.3.4.1.24";
						break;
					case 256:
						result = "2.16.840.1.101.3.4.1.44";
						break;
					default:
				}
				break;
			case "AES-KW":
				switch(algorithm.length)
				{
					case 128:
						result = "2.16.840.1.101.3.4.1.5";
						break;
					case 192:
						result = "2.16.840.1.101.3.4.1.25";
						break;
					case 256:
						result = "2.16.840.1.101.3.4.1.45";
						break;
					default:
				}
				break;
			case "HMAC":
				switch(algorithm.hash.name.toUpperCase())
				{
					case "SHA-1":
						result = "1.2.840.113549.2.7";
						break;
					case "SHA-256":
						result = "1.2.840.113549.2.9";
						break;
					case "SHA-384":
						result = "1.2.840.113549.2.10";
						break;
					case "SHA-512":
						result = "1.2.840.113549.2.11";
						break;
					default:
				}
				break;
			case "DH":
				result = "1.2.840.113549.1.9.16.3.5";
				break;
			case "SHA-1":
				result = "1.3.14.3.2.26";
				break;
			case "SHA-256":
				result = "2.16.840.1.101.3.4.2.1";
				break;
			case "SHA-384":
				result = "2.16.840.1.101.3.4.2.2";
				break;
			case "SHA-512":
				result = "2.16.840.1.101.3.4.2.3";
				break;
			case "CONCAT":
				break;
			case "HKDF":
				break;
			case "PBKDF2":
				result = "1.2.840.113549.1.5.12";
				break;
			//region Special case - OIDs for ECC curves
			case "P-256":
				result = "1.2.840.10045.3.1.7";
				break;
			case "P-384":
				result = "1.3.132.0.34";
				break;
			case "P-521":
				result = "1.3.132.0.35";
				break;
			//endregion
			default:
		}
		
		return result;
	}
	//**********************************************************************************
	/**
	 * Get default algorithm parameters for each kind of operation
	 * @param {string} algorithmName Algorithm name to get common parameters for
	 * @param {string} operation Kind of operation: "sign", "encrypt", "generatekey", "importkey", "exportkey", "verify"
	 * @returns {*}
	 */
	getAlgorithmParameters(algorithmName, operation)
	{
		let result = {
			algorithm: {},
			usages: []
		};
		
		switch(algorithmName.toUpperCase())
		{
			case "RSAES-PKCS1-V1_5":
			case "RSASSA-PKCS1-V1_5":
				switch(operation.toLowerCase())
				{
					case "generatekey":
						result = {
							algorithm: {
								name: "RSASSA-PKCS1-v1_5",
								modulusLength: 2048,
								publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
								hash: {
									name: "SHA-256"
								}
							},
							usages: ["sign", "verify"]
						};
						break;
					case "verify":
					case "sign":
					case "importkey":
						result = {
							algorithm: {
								name: "RSASSA-PKCS1-v1_5",
								hash: {
									name: "SHA-256"
								}
							},
							usages: ["verify"] // For importKey("pkcs8") usage must be "sign" only
						};
						break;
					case "exportkey":
					default:
						return {
							algorithm: {
								name: "RSASSA-PKCS1-v1_5"
							},
							usages: []
						};
				}
				break;
			case "RSA-PSS":
				switch(operation.toLowerCase())
				{
					case "sign":
					case "verify":
						result = {
							algorithm: {
								name: "RSA-PSS",
								hash: {
									name: "SHA-1"
								},
								saltLength: 20
							},
							usages: ["sign", "verify"]
						};
						break;
					case "generatekey":
						result = {
							algorithm: {
								name: "RSA-PSS",
								modulusLength: 2048,
								publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
								hash: {
									name: "SHA-1"
								}
							},
							usages: ["sign", "verify"]
						};
						break;
					case "importkey":
						result = {
							algorithm: {
								name: "RSA-PSS",
								hash: {
									name: "SHA-1"
								}
							},
							usages: ["verify"] // For importKey("pkcs8") usage must be "sign" only
						};
						break;
					case "exportkey":
					default:
						return {
							algorithm: {
								name: "RSA-PSS"
							},
							usages: []
						};
				}
				break;
			case "RSA-OAEP":
				switch(operation.toLowerCase())
				{
					case "encrypt":
					case "decrypt":
						result = {
							algorithm: {
								name: "RSA-OAEP"
							},
							usages: ["encrypt", "decrypt"]
						};
						break;
					case "generatekey":
						result = {
							algorithm: {
								name: "RSA-OAEP",
								modulusLength: 2048,
								publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
								hash: {
									name: "SHA-256"
								}
							},
							usages: ["encrypt", "decrypt", "wrapKey", "unwrapKey"]
						};
						break;
					case "importkey":
						result = {
							algorithm: {
								name: "RSA-OAEP",
								hash: {
									name: "SHA-256"
								}
							},
							usages: ["encrypt"] // encrypt for "spki" and decrypt for "pkcs8"
						};
						break;
					case "exportkey":
					default:
						return {
							algorithm: {
								name: "RSA-OAEP"
							},
							usages: []
						};
				}
				break;
			case "ECDSA":
				switch(operation.toLowerCase())
				{
					case "generatekey":
						result = {
							algorithm: {
								name: "ECDSA",
								namedCurve: "P-256"
							},
							usages: ["sign", "verify"]
						};
						break;
					case "importkey":
						result = {
							algorithm: {
								name: "ECDSA",
								namedCurve: "P-256"
							},
							usages: ["verify"] // "sign" for "pkcs8"
						};
						break;
					case "verify":
					case "sign":
						result = {
							algorithm: {
								name: "ECDSA",
								hash: {
									name: "SHA-256"
								}
							},
							usages: ["sign"]
						};
						break;
					default:
						return {
							algorithm: {
								name: "ECDSA"
							},
							usages: []
						};
				}
				break;
			case "ECDH":
				switch(operation.toLowerCase())
				{
					case "exportkey":
					case "importkey":
					case "generatekey":
						result = {
							algorithm: {
								name: "ECDH",
								namedCurve: "P-256"
							},
							usages: ["deriveKey", "deriveBits"]
						};
						break;
					case "derivekey":
					case "derivebits":
						result = {
							algorithm: {
								name: "ECDH",
								namedCurve: "P-256",
								public: [] // Must be a "publicKey"
							},
							usages: ["encrypt", "decrypt"]
						};
						break;
					default:
						return {
							algorithm: {
								name: "ECDH"
							},
							usages: []
						};
				}
				break;
			case "AES-CTR":
				switch(operation.toLowerCase())
				{
					case "importkey":
					case "exportkey":
					case "generatekey":
						result = {
							algorithm: {
								name: "AES-CTR",
								length: 256
							},
							usages: ["encrypt", "decrypt", "wrapKey", "unwrapKey"]
						};
						break;
					case "decrypt":
					case "encrypt":
						result = {
							algorithm: {
								name: "AES-CTR",
								counter: new Uint8Array(16),
								length: 10
							},
							usages: ["encrypt", "decrypt", "wrapKey", "unwrapKey"]
						};
						break;
					default:
						return {
							algorithm: {
								name: "AES-CTR"
							},
							usages: []
						};
				}
				break;
			case "AES-CBC":
				switch(operation.toLowerCase())
				{
					case "importkey":
					case "exportkey":
					case "generatekey":
						result = {
							algorithm: {
								name: "AES-CBC",
								length: 256
							},
							usages: ["encrypt", "decrypt", "wrapKey", "unwrapKey"]
						};
						break;
					case "decrypt":
					case "encrypt":
						result = {
							algorithm: {
								name: "AES-CBC",
								iv: this.getRandomValues(new Uint8Array(16)) // For "decrypt" the value should be replaced with value got on "encrypt" step
							},
							usages: ["encrypt", "decrypt", "wrapKey", "unwrapKey"]
						};
						break;
					default:
						return {
							algorithm: {
								name: "AES-CBC"
							},
							usages: []
						};
				}
				break;
			case "AES-GCM":
				switch(operation.toLowerCase())
				{
					case "importkey":
					case "exportkey":
					case "generatekey":
						result = {
							algorithm: {
								name: "AES-GCM",
								length: 256
							},
							usages: ["encrypt", "decrypt", "wrapKey", "unwrapKey"]
						};
						break;
					case "decrypt":
					case "encrypt":
						result = {
							algorithm: {
								name: "AES-GCM",
								iv: this.getRandomValues(new Uint8Array(16)) // For "decrypt" the value should be replaced with value got on "encrypt" step
							},
							usages: ["encrypt", "decrypt", "wrapKey", "unwrapKey"]
						};
						break;
					default:
						return {
							algorithm: {
								name: "AES-GCM"
							},
							usages: []
						};
				}
				break;
			case "AES-KW":
				switch(operation.toLowerCase())
				{
					case "importkey":
					case "exportkey":
					case "generatekey":
					case "wrapkey":
					case "unwrapkey":
						result = {
							algorithm: {
								name: "AES-KW",
								length: 256
							},
							usages: ["wrapKey", "unwrapKey"]
						};
						break;
					default:
						return {
							algorithm: {
								name: "AES-KW"
							},
							usages: []
						};
				}
				break;
			case "HMAC":
				switch(operation.toLowerCase())
				{
					case "sign":
					case "verify":
						result = {
							algorithm: {
								name: "HMAC"
							},
							usages: ["sign", "verify"]
						};
						break;
					case "importkey":
					case "exportkey":
					case "generatekey":
						result = {
							algorithm: {
								name: "HMAC",
								length: 32,
								hash: {
									name: "SHA-256"
								}
							},
							usages: ["sign", "verify"]
						};
						break;
					default:
						return {
							algorithm: {
								name: "HMAC"
							},
							usages: []
						};
				}
				break;
			case "HKDF":
				switch(operation.toLowerCase())
				{
					case "derivekey":
						result = {
							algorithm: {
								name: "HKDF",
								hash: "SHA-256",
								salt: new Uint8Array([]),
								info: new Uint8Array([])
							},
							usages: ["encrypt", "decrypt"]
						};
						break;
					default:
						return {
							algorithm: {
								name: "HKDF"
							},
							usages: []
						};
				}
				break;
			case "PBKDF2":
				switch(operation.toLowerCase())
				{
					case "derivekey":
						result = {
							algorithm: {
								name: "PBKDF2",
								hash: { name: "SHA-256" },
								salt: new Uint8Array([]),
								iterations: 10000
							},
							usages: ["encrypt", "decrypt"]
						};
						break;
					default:
						return {
							algorithm: {
								name: "PBKDF2"
							},
							usages: []
						};
				}
				break;
			default:
		}
		
		return result;
	}
	//**********************************************************************************
	/**
	 * Getting hash algorithm by signature algorithm
	 * @param {AlgorithmIdentifier} signatureAlgorithm Signature algorithm
	 * @returns {string}
	 */
	getHashAlgorithm(signatureAlgorithm)
	{
		let result = "";
		
		switch(signatureAlgorithm.algorithmId)
		{
			case "1.2.840.10045.4.1": // ecdsa-with-SHA1
			case "1.2.840.113549.1.1.5":
				result = "SHA-1";
				break;
			case "1.2.840.10045.4.3.2": // ecdsa-with-SHA256
			case "1.2.840.113549.1.1.11":
				result = "SHA-256";
				break;
			case "1.2.840.10045.4.3.3": // ecdsa-with-SHA384
			case "1.2.840.113549.1.1.12":
				result = "SHA-384";
				break;
			case "1.2.840.10045.4.3.4": // ecdsa-with-SHA512
			case "1.2.840.113549.1.1.13":
				result = "SHA-512";
				break;
			case "1.2.840.113549.1.1.10": // RSA-PSS
				{
					try
					{
						const params = new __WEBPACK_IMPORTED_MODULE_7__RSASSAPSSParams_js__["a" /* default */]({ schema: signatureAlgorithm.algorithmParams });
						if("hashAlgorithm" in params)
						{
							const algorithm = this.getAlgorithmByOID(params.hashAlgorithm.algorithmId);
							if(("name" in algorithm) === false)
								return "";
							
							result = algorithm.name;
						}
						else
							result = "SHA-1";
					}
					catch(ex)
					{
					}
				}
				break;
			default:
		}
		
		return result;
	}
	//**********************************************************************************
	/**
	 * Specialized function encrypting "EncryptedContentInfo" object using parameters
	 * @param {Object} parameters
	 * @returns {Promise}
	 */
	encryptEncryptedContentInfo(parameters)
	{
		//region Check for input parameters
		if((parameters instanceof Object) === false)
			return Promise.reject("Parameters must have type \"Object\"");
		
		if(("password" in parameters) === false)
			return Promise.reject("Absent mandatory parameter \"password\"");
		
		if(("contentEncryptionAlgorithm" in parameters) === false)
			return Promise.reject("Absent mandatory parameter \"contentEncryptionAlgorithm\"");
		
		if(("hmacHashAlgorithm" in parameters) === false)
			return Promise.reject("Absent mandatory parameter \"hmacHashAlgorithm\"");
		
		if(("iterationCount" in parameters) === false)
			return Promise.reject("Absent mandatory parameter \"iterationCount\"");
		
		if(("contentToEncrypt" in parameters) === false)
			return Promise.reject("Absent mandatory parameter \"contentToEncrypt\"");
		
		if(("contentType" in parameters) === false)
			return Promise.reject("Absent mandatory parameter \"contentType\"");

		const contentEncryptionOID = this.getOIDByAlgorithm(parameters.contentEncryptionAlgorithm);
		if(contentEncryptionOID === "")
			return Promise.reject("Wrong \"contentEncryptionAlgorithm\" value");
		
		const pbkdf2OID = this.getOIDByAlgorithm({
			name: "PBKDF2"
		});
		if(pbkdf2OID === "")
			return Promise.reject("Can not find OID for PBKDF2");
		
		const hmacOID = this.getOIDByAlgorithm({
			name: "HMAC",
			hash: {
				name: parameters.hmacHashAlgorithm
			}
		});
		if(hmacOID === "")
			return Promise.reject(`Incorrect value for "hmacHashAlgorithm": ${parameters.hmacHashAlgorithm}`);
		//endregion
		
		//region Initial variables
		let sequence = Promise.resolve();
		
		const ivBuffer = new ArrayBuffer(16); // For AES we need IV 16 bytes long
		const ivView = new Uint8Array(ivBuffer);
		this.getRandomValues(ivView);
		
		const saltBuffer = new ArrayBuffer(64);
		const saltView = new Uint8Array(saltBuffer);
		this.getRandomValues(saltView);
		
		const contentView = new Uint8Array(parameters.contentToEncrypt);
		
		const pbkdf2Params = new __WEBPACK_IMPORTED_MODULE_8__PBKDF2Params_js__["a" /* default */]({
			salt: new __WEBPACK_IMPORTED_MODULE_0_asn1js__["OctetString"]({ valueHex: saltBuffer }),
			iterationCount: parameters.iterationCount,
			prf: new __WEBPACK_IMPORTED_MODULE_5__AlgorithmIdentifier_js__["a" /* default */]({
				algorithmId: hmacOID,
				algorithmParams: new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Null"]()
			})
		});
		//endregion
		
		//region Derive PBKDF2 key from "password" buffer
		sequence = sequence.then(() =>
		{
			const passwordView = new Uint8Array(parameters.password);
			
			return this.importKey("raw",
				passwordView,
				"PBKDF2",
				false,
				["deriveKey"]);
		}, error =>
			Promise.reject(error)
		);
		//endregion
		
		//region Derive key for "contentEncryptionAlgorithm"
		sequence = sequence.then(result =>
			this.deriveKey({
				name: "PBKDF2",
				hash: {
					name: parameters.hmacHashAlgorithm
				},
				salt: saltView,
				iterations: parameters.iterationCount
			},
			result,
			parameters.contentEncryptionAlgorithm,
			false,
			["encrypt"]),
		error =>
			Promise.reject(error)
		);
		//endregion
		
		//region Encrypt content
		sequence = sequence.then(result =>
			this.encrypt({
				name: parameters.contentEncryptionAlgorithm.name,
				iv: ivView
			},
			result,
			contentView),
		error =>
			Promise.reject(error)
		);
		//endregion
		
		//region Store all parameters in EncryptedData object
		sequence = sequence.then(result =>
		{
			const pbes2Parameters = new __WEBPACK_IMPORTED_MODULE_9__PBES2Params_js__["a" /* default */]({
				keyDerivationFunc: new __WEBPACK_IMPORTED_MODULE_5__AlgorithmIdentifier_js__["a" /* default */]({
					algorithmId: pbkdf2OID,
					algorithmParams: pbkdf2Params.toSchema()
				}),
				encryptionScheme: new __WEBPACK_IMPORTED_MODULE_5__AlgorithmIdentifier_js__["a" /* default */]({
					algorithmId: contentEncryptionOID,
					algorithmParams: new __WEBPACK_IMPORTED_MODULE_0_asn1js__["OctetString"]({ valueHex: ivBuffer })
				})
			});
			
			return new __WEBPACK_IMPORTED_MODULE_6__EncryptedContentInfo_js__["a" /* default */]({
				contentType: parameters.contentType,
				contentEncryptionAlgorithm: new __WEBPACK_IMPORTED_MODULE_5__AlgorithmIdentifier_js__["a" /* default */]({
					algorithmId: "1.2.840.113549.1.5.13", // pkcs5PBES2
					algorithmParams: pbes2Parameters.toSchema()
				}),
				encryptedContent: new __WEBPACK_IMPORTED_MODULE_0_asn1js__["OctetString"]({ valueHex: result })
			});
		}, error =>
			Promise.reject(error)
		);
		//endregion

		return sequence;
	}
	//**********************************************************************************
	/**
	 * Decrypt data stored in "EncryptedContentInfo" object using parameters
	 * @param parameters
	 * @return {Promise}
	 */
	decryptEncryptedContentInfo(parameters)
	{
		//region Check for input parameters
		if((parameters instanceof Object) === false)
			return Promise.reject("Parameters must have type \"Object\"");
		
		if(("password" in parameters) === false)
			return Promise.reject("Absent mandatory parameter \"password\"");
		
		if(("encryptedContentInfo" in parameters) === false)
			return Promise.reject("Absent mandatory parameter \"encryptedContentInfo\"");

		if(parameters.encryptedContentInfo.contentEncryptionAlgorithm.algorithmId !== "1.2.840.113549.1.5.13") // pkcs5PBES2
			return Promise.reject(`Unknown "contentEncryptionAlgorithm": ${parameters.encryptedContentInfo.contentEncryptionAlgorithm.algorithmId}`);
		//endregion
		
		//region Initial variables
		let sequence = Promise.resolve();
		
		let pbes2Parameters;
		
		try
		{
			pbes2Parameters = new __WEBPACK_IMPORTED_MODULE_9__PBES2Params_js__["a" /* default */]({ schema: parameters.encryptedContentInfo.contentEncryptionAlgorithm.algorithmParams });
		}
		catch(ex)
		{
			return Promise.reject("Incorrectly encoded \"pbes2Parameters\"");
		}
		
		let pbkdf2Params;
		
		try
		{
			pbkdf2Params = new __WEBPACK_IMPORTED_MODULE_8__PBKDF2Params_js__["a" /* default */]({ schema: pbes2Parameters.keyDerivationFunc.algorithmParams });
		}
		catch(ex)
		{
			return Promise.reject("Incorrectly encoded \"pbkdf2Params\"");
		}
		
		const contentEncryptionAlgorithm = this.getAlgorithmByOID(pbes2Parameters.encryptionScheme.algorithmId);
		if(("name" in contentEncryptionAlgorithm) === false)
			return Promise.reject(`Incorrect OID for "contentEncryptionAlgorithm": ${pbes2Parameters.encryptionScheme.algorithmId}`);
		
		const ivBuffer = pbes2Parameters.encryptionScheme.algorithmParams.valueBlock.valueHex;
		const ivView = new Uint8Array(ivBuffer);
		
		const saltBuffer = pbkdf2Params.salt.valueBlock.valueHex;
		const saltView = new Uint8Array(saltBuffer);
		
		const iterationCount = pbkdf2Params.iterationCount;
		
		let hmacHashAlgorithm = "SHA-1";
		
		if("prf" in pbkdf2Params)
		{
			const algorithm = this.getAlgorithmByOID(pbkdf2Params.prf.algorithmId);
			if(("name" in algorithm) === false)
				return Promise.reject("Incorrect OID for HMAC hash algorithm");
			
			hmacHashAlgorithm = algorithm.hash.name;
		}
		//endregion
		
		//region Derive PBKDF2 key from "password" buffer
		sequence = sequence.then(() =>
			this.importKey("raw",
				parameters.password,
				"PBKDF2",
				false,
				["deriveKey"]),
		error =>
			Promise.reject(error)
		);
		//endregion
		
		//region Derive key for "contentEncryptionAlgorithm"
		sequence = sequence.then(result =>
			this.deriveKey({
				name: "PBKDF2",
				hash: {
					name: hmacHashAlgorithm
				},
				salt: saltView,
				iterations: iterationCount
			},
			result,
			contentEncryptionAlgorithm,
			false,
			["decrypt"]),
		error =>
			Promise.reject(error)
		);
		//endregion
		
		//region Decrypt internal content using derived key
		sequence = sequence.then(result =>
		{
			//region Create correct data block for decryption
			let dataBuffer = new ArrayBuffer(0);
			
			if(parameters.encryptedContentInfo.encryptedContent.idBlock.isConstructed === false)
				dataBuffer = parameters.encryptedContentInfo.encryptedContent.valueBlock.valueHex;
			else
			{
				for(const content of parameters.encryptedContentInfo.encryptedContent.valueBlock.value)
					dataBuffer = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["utilConcatBuf"])(dataBuffer, content.valueBlock.valueHex);
			}
			//endregion
			
			return this.decrypt({
				name: contentEncryptionAlgorithm.name,
				iv: ivView
			},
			result,
			dataBuffer);
		}, error =>
			Promise.reject(error)
		);
		//endregion
		
		return sequence;
	}
	//**********************************************************************************
	/**
	 * Stamping (signing) data using algorithm simular to HMAC
	 * @param {Object} parameters
	 * @return {Promise.<T>|Promise}
	 */
	stampDataWithPassword(parameters)
	{
		//region Check for input parameters
		if((parameters instanceof Object) === false)
			return Promise.reject("Parameters must have type \"Object\"");
		
		if(("password" in parameters) === false)
			return Promise.reject("Absent mandatory parameter \"password\"");
		
		if(("hashAlgorithm" in parameters) === false)
			return Promise.reject("Absent mandatory parameter \"hashAlgorithm\"");
		
		if(("salt" in parameters) === false)
			return Promise.reject("Absent mandatory parameter \"iterationCount\"");
		
		if(("iterationCount" in parameters) === false)
			return Promise.reject("Absent mandatory parameter \"salt\"");
		
		if(("contentToStamp" in parameters) === false)
			return Promise.reject("Absent mandatory parameter \"contentToStamp\"");
		//endregion
		
		//region Choose correct length for HMAC key
		let length;
		
		switch(parameters.hashAlgorithm.toLowerCase())
		{
			case "sha-1":
				length = 160;
				break;
			case "sha-256":
				length = 256;
				break;
			case "sha-384":
				length = 384;
				break;
			case "sha-512":
				length = 512;
				break;
			default:
				return Promise.reject(`Incorrect "parameters.hashAlgorithm" parameter: ${parameters.hashAlgorithm}`);
		}
		//endregion
		
		//region Initial variables
		let sequence = Promise.resolve();
		
		const hmacAlgorithm = {
			name: "HMAC",
			length,
			hash: {
				name: parameters.hashAlgorithm
			}
		};
		//endregion

		//region Create PKCS#12 key for integrity checking
		sequence = sequence.then(() => makePKCS12B2Key(this, parameters.hashAlgorithm, length, parameters.password, parameters.salt, parameters.iterationCount));
		//endregion
		
		//region Import HMAC key
		// noinspection JSCheckFunctionSignatures
		sequence = sequence.then(
			result =>
				this.importKey("raw",
					new Uint8Array(result),
					hmacAlgorithm,
					false,
					["sign"])
		);
		//endregion
		
		//region Make signed HMAC value
		sequence = sequence.then(
			result =>
				this.sign(hmacAlgorithm, result, new Uint8Array(parameters.contentToStamp)),
			error => Promise.reject(error)
		);
		//endregion

		return sequence;
	}
	//**********************************************************************************
	verifyDataStampedWithPassword(parameters)
	{
		//region Check for input parameters
		if((parameters instanceof Object) === false)
			return Promise.reject("Parameters must have type \"Object\"");
		
		if(("password" in parameters) === false)
			return Promise.reject("Absent mandatory parameter \"password\"");
		
		if(("hashAlgorithm" in parameters) === false)
			return Promise.reject("Absent mandatory parameter \"hashAlgorithm\"");
		
		if(("salt" in parameters) === false)
			return Promise.reject("Absent mandatory parameter \"iterationCount\"");
		
		if(("iterationCount" in parameters) === false)
			return Promise.reject("Absent mandatory parameter \"salt\"");
		
		if(("contentToVerify" in parameters) === false)
			return Promise.reject("Absent mandatory parameter \"contentToVerify\"");
		
		if(("signatureToVerify" in parameters) === false)
			return Promise.reject("Absent mandatory parameter \"signatureToVerify\"");
		//endregion
		
		//region Choose correct length for HMAC key
		let length;
		
		switch(parameters.hashAlgorithm.toLowerCase())
		{
			case "sha-1":
				length = 160;
				break;
			case "sha-256":
				length = 256;
				break;
			case "sha-384":
				length = 384;
				break;
			case "sha-512":
				length = 512;
				break;
			default:
				return Promise.reject(`Incorrect "parameters.hashAlgorithm" parameter: ${parameters.hashAlgorithm}`);
		}
		//endregion
		
		//region Initial variables
		let sequence = Promise.resolve();
		
		const hmacAlgorithm = {
			name: "HMAC",
			length,
			hash: {
				name: parameters.hashAlgorithm
			}
		};
		//endregion
		
		//region Create PKCS#12 key for integrity checking
		sequence = sequence.then(() => makePKCS12B2Key(this, parameters.hashAlgorithm, length, parameters.password, parameters.salt, parameters.iterationCount));
		//endregion
		
		//region Import HMAC key
		// noinspection JSCheckFunctionSignatures
		sequence = sequence.then(result =>
			this.importKey("raw",
				new Uint8Array(result),
				hmacAlgorithm,
				false,
				["verify"])
		);
		//endregion
		
		//region Make signed HMAC value
		sequence = sequence.then(
			result =>
				this.verify(hmacAlgorithm, result, new Uint8Array(parameters.signatureToVerify), new Uint8Array(parameters.contentToVerify)),
			error => Promise.reject(error)
		);
		//endregion
		
		return sequence;
	}
	//**********************************************************************************
	/**
	 * Get signature parameters by analyzing private key algorithm
	 * @param {Object} privateKey The private key user would like to use
	 * @param {string} [hashAlgorithm="SHA-1"] Hash algorithm user would like to use
	 * @return {Promise.<T>|Promise}
	 */
	getSignatureParameters(privateKey, hashAlgorithm = "SHA-1")
	{
		//region Check hashing algorithm
		const oid = this.getOIDByAlgorithm({ name: hashAlgorithm });
		if(oid === "")
			return Promise.reject(`Unsupported hash algorithm: ${hashAlgorithm}`);
		//endregion
		
		//region Initial variables
		const signatureAlgorithm = new __WEBPACK_IMPORTED_MODULE_5__AlgorithmIdentifier_js__["a" /* default */]();
		//endregion
		
		//region Get a "default parameters" for current algorithm
		const parameters = this.getAlgorithmParameters(privateKey.algorithm.name, "sign");
		parameters.algorithm.hash.name = hashAlgorithm;
		//endregion
		
		//region Fill internal structures base on "privateKey" and "hashAlgorithm"
		switch(privateKey.algorithm.name.toUpperCase())
		{
			case "RSASSA-PKCS1-V1_5":
			case "ECDSA":
				signatureAlgorithm.algorithmId = this.getOIDByAlgorithm(parameters.algorithm);
				break;
			case "RSA-PSS":
				{
					//region Set "saltLength" as a length (in octets) of hash function result
					switch(hashAlgorithm.toUpperCase())
					{
						case "SHA-256":
							parameters.algorithm.saltLength = 32;
							break;
						case "SHA-384":
							parameters.algorithm.saltLength = 48;
							break;
						case "SHA-512":
							parameters.algorithm.saltLength = 64;
							break;
						default:
					}
					//endregion
					
					//region Fill "RSASSA_PSS_params" object
					const paramsObject = {};
					
					if(hashAlgorithm.toUpperCase() !== "SHA-1")
					{
						const hashAlgorithmOID = this.getOIDByAlgorithm({ name: hashAlgorithm });
						if(hashAlgorithmOID === "")
							return Promise.reject(`Unsupported hash algorithm: ${hashAlgorithm}`);
						
						paramsObject.hashAlgorithm = new __WEBPACK_IMPORTED_MODULE_5__AlgorithmIdentifier_js__["a" /* default */]({
							algorithmId: hashAlgorithmOID,
							algorithmParams: new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Null"]()
						});
						
						paramsObject.maskGenAlgorithm = new __WEBPACK_IMPORTED_MODULE_5__AlgorithmIdentifier_js__["a" /* default */]({
							algorithmId: "1.2.840.113549.1.1.8", // MGF1
							algorithmParams: paramsObject.hashAlgorithm.toSchema()
						});
					}
					
					if(parameters.algorithm.saltLength !== 20)
						paramsObject.saltLength = parameters.algorithm.saltLength;
					
					const pssParameters = new __WEBPACK_IMPORTED_MODULE_7__RSASSAPSSParams_js__["a" /* default */](paramsObject);
					//endregion
					
					//region Automatically set signature algorithm
					signatureAlgorithm.algorithmId = "1.2.840.113549.1.1.10";
					signatureAlgorithm.algorithmParams = pssParameters.toSchema();
					//endregion
				}
				break;
			default:
				return Promise.reject(`Unsupported signature algorithm: ${privateKey.algorithm.name}`);
		}
		//endregion

		return Promise.resolve().then(() => ({
			signatureAlgorithm,
			parameters
		}));
	}
	//**********************************************************************************
	/**
	 * Sign data with pre-defined private key
	 * @param {ArrayBuffer} data Data to be signed
	 * @param {Object} privateKey Private key to use
	 * @param {Object} parameters Parameters for used algorithm
	 * @return {Promise.<T>|Promise}
	 */
	signWithPrivateKey(data, privateKey, parameters)
	{
		return this.sign(parameters.algorithm,
			privateKey,
			new Uint8Array(data))
			.then(result =>
			{
				//region Special case for ECDSA algorithm
				if(parameters.algorithm.name === "ECDSA")
					result = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__common_js__["b" /* createCMSECDSASignature */])(result);
				//endregion
				
				return result;
			}, error =>
				Promise.reject(`Signing error: ${error}`)
			);
	}
	//**********************************************************************************
	fillPublicKeyParameters(publicKeyInfo, signatureAlgorithm)
	{
		const parameters = {};
		
		//region Find signer's hashing algorithm
		const shaAlgorithm = this.getHashAlgorithm(signatureAlgorithm);
		if(shaAlgorithm === "")
			return Promise.reject(`Unsupported signature algorithm: ${signatureAlgorithm.algorithmId}`);
		//endregion
		
		//region Get information about public key algorithm and default parameters for import
		let algorithmId;
		if(signatureAlgorithm.algorithmId === "1.2.840.113549.1.1.10")
			algorithmId = signatureAlgorithm.algorithmId;
		else
			algorithmId = publicKeyInfo.algorithm.algorithmId;
		
		const algorithmObject = this.getAlgorithmByOID(algorithmId);
		if(("name" in algorithmObject) === "")
			return Promise.reject(`Unsupported public key algorithm: ${signatureAlgorithm.algorithmId}`);
		
		parameters.algorithm = this.getAlgorithmParameters(algorithmObject.name, "importkey");
		if("hash" in parameters.algorithm.algorithm)
			parameters.algorithm.algorithm.hash.name = shaAlgorithm;
		
		//region Special case for ECDSA
		if(algorithmObject.name === "ECDSA")
		{
			//region Get information about named curve
			let algorithmParamsChecked = false;
			
			if(("algorithmParams" in publicKeyInfo.algorithm) === true)
			{
				if("idBlock" in publicKeyInfo.algorithm.algorithmParams)
				{
					if((publicKeyInfo.algorithm.algorithmParams.idBlock.tagClass === 1) && (publicKeyInfo.algorithm.algorithmParams.idBlock.tagNumber === 6))
						algorithmParamsChecked = true;
				}
			}
			
			if(algorithmParamsChecked === false)
				return Promise.reject("Incorrect type for ECDSA public key parameters");
			
			const curveObject = this.getAlgorithmByOID(publicKeyInfo.algorithm.algorithmParams.valueBlock.toString());
			if(("name" in curveObject) === false)
				return Promise.reject(`Unsupported named curve algorithm: ${publicKeyInfo.algorithm.algorithmParams.valueBlock.toString()}`);
			//endregion
			
			parameters.algorithm.algorithm.namedCurve = curveObject.name;
		}
		//endregion
		//endregion
		
		return parameters;
	}
	//**********************************************************************************
	getPublicKey(publicKeyInfo, signatureAlgorithm, parameters = null)
	{
		if(parameters === null)
			parameters = this.fillPublicKeyParameters(publicKeyInfo, signatureAlgorithm);
		
		const publicKeyInfoSchema = publicKeyInfo.toSchema();
		const publicKeyInfoBuffer = publicKeyInfoSchema.toBER(false);
		const publicKeyInfoView = new Uint8Array(publicKeyInfoBuffer);
		
		return this.importKey("spki",
			publicKeyInfoView,
			parameters.algorithm.algorithm,
			true,
			parameters.algorithm.usages
		);
	}
	//**********************************************************************************
	verifyWithPublicKey(data, signature, publicKeyInfo, signatureAlgorithm, shaAlgorithm = null)
	{
		//region Initial variables
		let sequence = Promise.resolve();
		//endregion
		
		//region Find signer's hashing algorithm
		if(shaAlgorithm === null)
		{
			shaAlgorithm = this.getHashAlgorithm(signatureAlgorithm);
			if(shaAlgorithm === "")
				return Promise.reject(`Unsupported signature algorithm: ${signatureAlgorithm.algorithmId}`);
			
			//region Import public key
			sequence = sequence.then(() =>
				this.getPublicKey(publicKeyInfo, signatureAlgorithm));
			//endregion
		}
		else
		{
			const parameters = {};
			
			//region Get information about public key algorithm and default parameters for import
			let algorithmId;
			if(signatureAlgorithm.algorithmId === "1.2.840.113549.1.1.10")
				algorithmId = signatureAlgorithm.algorithmId;
			else
				algorithmId = publicKeyInfo.algorithm.algorithmId;
			
			const algorithmObject = this.getAlgorithmByOID(algorithmId);
			if(("name" in algorithmObject) === "")
				return Promise.reject(`Unsupported public key algorithm: ${signatureAlgorithm.algorithmId}`);
			
			parameters.algorithm = this.getAlgorithmParameters(algorithmObject.name, "importkey");
			if("hash" in parameters.algorithm.algorithm)
				parameters.algorithm.algorithm.hash.name = shaAlgorithm;
			
			//region Special case for ECDSA
			if(algorithmObject.name === "ECDSA")
			{
				//region Get information about named curve
				let algorithmParamsChecked = false;
				
				if(("algorithmParams" in publicKeyInfo.algorithm) === true)
				{
					if("idBlock" in publicKeyInfo.algorithm.algorithmParams)
					{
						if((publicKeyInfo.algorithm.algorithmParams.idBlock.tagClass === 1) && (publicKeyInfo.algorithm.algorithmParams.idBlock.tagNumber === 6))
							algorithmParamsChecked = true;
					}
				}
				
				if(algorithmParamsChecked === false)
					return Promise.reject("Incorrect type for ECDSA public key parameters");
				
				const curveObject = this.getAlgorithmByOID(publicKeyInfo.algorithm.algorithmParams.valueBlock.toString());
				if(("name" in curveObject) === false)
					return Promise.reject(`Unsupported named curve algorithm: ${publicKeyInfo.algorithm.algorithmParams.valueBlock.toString()}`);
				//endregion
				
				parameters.algorithm.algorithm.namedCurve = curveObject.name;
			}
			//endregion
			//endregion

			//region Import public key
			sequence = sequence.then(() =>
				this.getPublicKey(publicKeyInfo, null, parameters));
			//endregion
		}
		//endregion
		
		//region Verify signature
		sequence = sequence.then(publicKey =>
		{
			//region Get default algorithm parameters for verification
			const algorithm = this.getAlgorithmParameters(publicKey.algorithm.name, "verify");
			if("hash" in algorithm.algorithm)
				algorithm.algorithm.hash.name = shaAlgorithm;
			//endregion
			
			//region Special case for ECDSA signatures
			let signatureValue = signature.valueBlock.valueHex;
			
			if(publicKey.algorithm.name === "ECDSA")
			{
				const asn1 = __WEBPACK_IMPORTED_MODULE_0_asn1js__["fromBER"](signatureValue);
				// noinspection JSCheckFunctionSignatures
				signatureValue = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__common_js__["c" /* createECDSASignatureFromCMS */])(asn1.result);
			}
			//endregion
			
			//region Special case for RSA-PSS
			if(publicKey.algorithm.name === "RSA-PSS")
			{
				let pssParameters;
				
				try
				{
					pssParameters = new __WEBPACK_IMPORTED_MODULE_7__RSASSAPSSParams_js__["a" /* default */]({ schema: signatureAlgorithm.algorithmParams });
				}
				catch(ex)
				{
					return Promise.reject(ex);
				}
				
				if("saltLength" in pssParameters)
					algorithm.algorithm.saltLength = pssParameters.saltLength;
				else
					algorithm.algorithm.saltLength = 20;
				
				let hashAlgo = "SHA-1";
				
				if("hashAlgorithm" in pssParameters)
				{
					const hashAlgorithm = this.getAlgorithmByOID(pssParameters.hashAlgorithm.algorithmId);
					if(("name" in hashAlgorithm) === false)
						return Promise.reject(`Unrecognized hash algorithm: ${pssParameters.hashAlgorithm.algorithmId}`);
					
					hashAlgo = hashAlgorithm.name;
				}
				
				algorithm.algorithm.hash.name = hashAlgo;
			}
			//endregion
			
			return this.verify(algorithm.algorithm,
				publicKey,
				new Uint8Array(signatureValue),
				new Uint8Array(data)
			);
		});
		//endregion
		
		return sequence;
	}
	//**********************************************************************************
}/* harmony export */ exports["a"] = CryptoEngine;
//**************************************************************************************


/***/ },

/***/ "./node_modules/pkijs/src/ECPrivateKey.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js__ = __webpack_require__("./node_modules/asn1js/build/asn1.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_asn1js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pvutils__ = __webpack_require__("./node_modules/pvutils/src/utils.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ECPublicKey_js__ = __webpack_require__("./node_modules/pkijs/src/ECPublicKey.js");



//**************************************************************************************
/**
 * Class from RFC5915
 */
class ECPrivateKey
{
	//**********************************************************************************
	/**
	 * Constructor for ECPrivateKey class
	 * @param {Object} [parameters={}]
	 * @param {Object} [parameters.schema] asn1js parsed value to initialize the class from
	 */
	constructor(parameters = {})
	{
		//region Internal properties of the object
		/**
		 * @type {number}
		 * @desc version
		 */
		this.version = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "version", ECPrivateKey.defaultValues("version"));
		/**
		 * @type {OctetString}
		 * @desc privateKey
		 */
		this.privateKey = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "privateKey", ECPrivateKey.defaultValues("privateKey"));

		if("namedCurve" in parameters)
			/**
			 * @type {string}
			 * @desc namedCurve
			 */
			this.namedCurve = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "namedCurve", ECPrivateKey.defaultValues("namedCurve"));

		if("publicKey" in parameters)
			/**
			 * @type {ECPublicKey}
			 * @desc publicKey
			 */
			this.publicKey = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "publicKey", ECPrivateKey.defaultValues("publicKey"));
		//endregion

		//region If input argument array contains "schema" for this object
		if("schema" in parameters)
			this.fromSchema(parameters.schema);
		//endregion
		//region If input argument array contains "json" for this object
		if("json" in parameters)
			this.fromJSON(parameters.json);
		//endregion
	}
	//**********************************************************************************
	/**
	 * Return default values for all class members
	 * @param {string} memberName String name for a class member
	 */
	static defaultValues(memberName)
	{
		switch(memberName)
		{
			case "version":
				return 1;
			case "privateKey":
				return new __WEBPACK_IMPORTED_MODULE_0_asn1js__["OctetString"]();
			case "namedCurve":
				return "";
			case "publicKey":
				return new __WEBPACK_IMPORTED_MODULE_2__ECPublicKey_js__["a" /* default */]();
			default:
				throw new Error(`Invalid member name for ECCPrivateKey class: ${memberName}`);
		}
	}
	//**********************************************************************************
	/**
	 * Compare values with default values for all class members
	 * @param {string} memberName String name for a class member
	 * @param {*} memberValue Value to compare with default value
	 */
	static compareWithDefault(memberName, memberValue)
	{
		switch(memberName)
		{
			case "version":
				return (memberValue === ECPrivateKey.defaultValues(memberName));
			case "privateKey":
				return (memberValue.isEqual(ECPrivateKey.defaultValues(memberName)));
			case "namedCurve":
				return (memberValue === "");
			case "publicKey":
				return ((__WEBPACK_IMPORTED_MODULE_2__ECPublicKey_js__["a" /* default */].compareWithDefault("namedCurve", memberValue.namedCurve)) &&
						(__WEBPACK_IMPORTED_MODULE_2__ECPublicKey_js__["a" /* default */].compareWithDefault("x", memberValue.x)) &&
						(__WEBPACK_IMPORTED_MODULE_2__ECPublicKey_js__["a" /* default */].compareWithDefault("y", memberValue.y)));
			default:
				throw new Error(`Invalid member name for ECCPrivateKey class: ${memberName}`);
		}
	}
	//**********************************************************************************
	/**
	 * Return value of pre-defined ASN.1 schema for current class
	 *
	 * ASN.1 schema:
	 * ```asn1
	 * ECPrivateKey ::= SEQUENCE {
	 * version        INTEGER { ecPrivkeyVer1(1) } (ecPrivkeyVer1),
	 * privateKey     OCTET STRING,
	 * parameters [0] ECParameters {{ NamedCurve }} OPTIONAL,
	 * publicKey  [1] BIT STRING OPTIONAL
	 * }
	 * ```
	 *
	 * @param {Object} parameters Input parameters for the schema
	 * @returns {Object} asn1js schema object
	 */
	static schema(parameters = {})
	{
		/**
		 * @type {Object}
		 * @property {string} [blockName]
		 * @property {string} [version]
		 * @property {string} [privateKey]
		 * @property {string} [namedCurve]
		 * @property {string} [publicKey]
		 */
		const names = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "names", {});

		return (new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
			name: (names.blockName || ""),
			value: [
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ name: (names.version || "") }),
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["OctetString"]({ name: (names.privateKey || "") }),
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Constructed"]({
					optional: true,
					idBlock: {
						tagClass: 3, // CONTEXT-SPECIFIC
						tagNumber: 0 // [0]
					},
					value: [
						new __WEBPACK_IMPORTED_MODULE_0_asn1js__["ObjectIdentifier"]({ name: (names.namedCurve || "") })
					]
				}),
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Constructed"]({
					optional: true,
					idBlock: {
						tagClass: 3, // CONTEXT-SPECIFIC
						tagNumber: 1 // [1]
					},
					value: [
						new __WEBPACK_IMPORTED_MODULE_0_asn1js__["BitString"]({ name: (names.publicKey || "") })
					]
				})
			]
		}));
	}
	//**********************************************************************************
	/**
	 * Convert parsed asn1js object into current class
	 * @param {!Object} schema
	 */
	fromSchema(schema)
	{
		//region Clear input data first
		__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["clearProps"])(schema, [
			"version",
			"privateKey",
			"namedCurve",
			"publicKey"
		]);
		//endregion
		
		//region Check the schema is valid
		const asn1 = __WEBPACK_IMPORTED_MODULE_0_asn1js__["compareSchema"](schema,
			schema,
			ECPrivateKey.schema({
				names: {
					version: "version",
					privateKey: "privateKey",
					namedCurve: "namedCurve",
					publicKey: "publicKey"
				}
			})
		);

		if(asn1.verified === false)
			throw new Error("Object's schema was not verified against input data for ECPrivateKey");
		//endregion

		//region Get internal properties from parsed schema
		this.version = asn1.result.version.valueBlock.valueDec;
		this.privateKey = asn1.result.privateKey;

		if("namedCurve" in asn1.result)
			this.namedCurve = asn1.result.namedCurve.valueBlock.toString();

		if("publicKey" in asn1.result)
		{
			const publicKeyData = { schema: asn1.result.publicKey.valueBlock.valueHex };
			if("namedCurve" in this)
				publicKeyData.namedCurve = this.namedCurve;

			this.publicKey = new __WEBPACK_IMPORTED_MODULE_2__ECPublicKey_js__["a" /* default */](publicKeyData);
		}
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convert current object to asn1js object and set correct values
	 * @returns {Object} asn1js object
	 */
	toSchema()
	{
		const outputArray = [
			new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ value: this.version }),
			this.privateKey
		];

		if("namedCurve" in this)
		{
			outputArray.push(new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Constructed"]({
				idBlock: {
					tagClass: 3, // CONTEXT-SPECIFIC
					tagNumber: 0 // [0]
				},
				value: [
					new __WEBPACK_IMPORTED_MODULE_0_asn1js__["ObjectIdentifier"]({ value: this.namedCurve })
				]
			}));
		}

		if("publicKey" in this)
		{
			outputArray.push(new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Constructed"]({
				idBlock: {
					tagClass: 3, // CONTEXT-SPECIFIC
					tagNumber: 1 // [1]
				},
				value: [
					new __WEBPACK_IMPORTED_MODULE_0_asn1js__["BitString"]({ valueHex: this.publicKey.toSchema().toBER(false) })
				]
			}));
		}

		return new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
			value: outputArray
		});
	}
	//**********************************************************************************
	/**
	 * Convertion for the class to JSON object
	 * @returns {Object}
	 */
	toJSON()
	{
		if((("namedCurve" in this) === false) || (ECPrivateKey.compareWithDefault("namedCurve", this.namedCurve)))
			throw new Error("Not enough information for making JSON: absent \"namedCurve\" value");

		let crvName = "";

		switch(this.namedCurve)
		{
			case "1.2.840.10045.3.1.7": // P-256
				crvName = "P-256";
				break;
			case "1.3.132.0.34": // P-384
				crvName = "P-384";
				break;
			case "1.3.132.0.35": // P-521
				crvName = "P-521";
				break;
			default:
		}

		const privateKeyJSON = {
			crv: crvName,
			d: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["toBase64"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["arrayBufferToString"])(this.privateKey.valueBlock.valueHex), true, true, false)
		};

		if("publicKey" in this)
		{
			const publicKeyJSON = this.publicKey.toJSON();

			privateKeyJSON.x = publicKeyJSON.x;
			privateKeyJSON.y = publicKeyJSON.y;
		}

		return privateKeyJSON;
	}
	//**********************************************************************************
	/**
	 * Convert JSON value into current object
	 * @param {Object} json
	 */
	fromJSON(json)
	{
		let coodinateLength = 0;

		if("crv" in json)
		{
			switch(json.crv.toUpperCase())
			{
				case "P-256":
					this.namedCurve = "1.2.840.10045.3.1.7";
					coodinateLength = 32;
					break;
				case "P-384":
					this.namedCurve = "1.3.132.0.34";
					coodinateLength = 48;
					break;
				case "P-521":
					this.namedCurve = "1.3.132.0.35";
					coodinateLength = 66;
					break;
				default:
			}
		}
		else
			throw new Error("Absent mandatory parameter \"crv\"");

		if("d" in json)
		{
			const convertBuffer = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["stringToArrayBuffer"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["fromBase64"])(json.d, true));
			
			if(convertBuffer.byteLength < coodinateLength)
			{
				const buffer = new ArrayBuffer(coodinateLength);
				const view = new Uint8Array(buffer);
				const convertBufferView = new Uint8Array(convertBuffer);
				view.set(convertBufferView, 1);
				
				this.privateKey = new __WEBPACK_IMPORTED_MODULE_0_asn1js__["OctetString"]({ valueHex: buffer });
			}
			else
				this.privateKey = new __WEBPACK_IMPORTED_MODULE_0_asn1js__["OctetString"]({ valueHex: convertBuffer.slice(0, coodinateLength) });
		}
		else
			throw new Error("Absent mandatory parameter \"d\"");

		if(("x" in json) && ("y" in json))
			this.publicKey = new __WEBPACK_IMPORTED_MODULE_2__ECPublicKey_js__["a" /* default */]({ json });
	}
	//**********************************************************************************
}/* harmony export */ exports["a"] = ECPrivateKey;
//**************************************************************************************


/***/ },

/***/ "./node_modules/pkijs/src/ECPublicKey.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js__ = __webpack_require__("./node_modules/asn1js/build/asn1.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_asn1js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pvutils__ = __webpack_require__("./node_modules/pvutils/src/utils.js");


//**************************************************************************************
/**
 * Class from RFC5480
 */
class ECPublicKey
{
	//**********************************************************************************
	/**
	 * Constructor for ECCPublicKey class
	 * @param {Object} [parameters={}]
	 * @param {Object} [parameters.schema] asn1js parsed value to initialize the class from
	 */
	constructor(parameters = {})
	{
		//region Internal properties of the object
		/**
		 * @type {ArrayBuffer}
		 * @desc type
		 */
		this.x = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "x", ECPublicKey.defaultValues("x"));
		/**
		 * @type {ArrayBuffer}
		 * @desc values
		 */
		this.y = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "y", ECPublicKey.defaultValues("y"));
		/**
		 * @type {string}
		 * @desc namedCurve
		 */
		this.namedCurve = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "namedCurve", ECPublicKey.defaultValues("namedCurve"));
		//endregion

		//region If input argument array contains "schema" for this object
		if("schema" in parameters)
			this.fromSchema(parameters.schema);
		//endregion
		//region If input argument array contains "json" for this object
		if("json" in parameters)
			this.fromJSON(parameters.json);
		//endregion
	}
	//**********************************************************************************
	/**
	 * Return default values for all class members
	 * @param {string} memberName String name for a class member
	 */
	static defaultValues(memberName)
	{
		switch(memberName)
		{
			case "x":
			case "y":
				return new ArrayBuffer(0);
			case "namedCurve":
				return "";
			default:
				throw new Error(`Invalid member name for ECCPublicKey class: ${memberName}`);
		}
	}
	//**********************************************************************************
	/**
	 * Compare values with default values for all class members
	 * @param {string} memberName String name for a class member
	 * @param {*} memberValue Value to compare with default value
	 */
	static compareWithDefault(memberName, memberValue)
	{
		switch(memberName)
		{
			case "x":
			case "y":
				return (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["isEqualBuffer"])(memberValue, ECPublicKey.defaultValues(memberName)));
			case "namedCurve":
				return (memberValue === "");
			default:
				throw new Error(`Invalid member name for ECCPublicKey class: ${memberName}`);
		}
	}
	//**********************************************************************************
	/**
	 * Return value of pre-defined ASN.1 schema for current class
	 * @param {Object} parameters Input parameters for the schema
	 * @returns {Object} asn1js schema object
	 */
	static schema(parameters = {})
	{
		return new __WEBPACK_IMPORTED_MODULE_0_asn1js__["RawData"]();
	}
	//**********************************************************************************
	/**
	 * Convert ArrayBuffer into current class
	 * @param {!ArrayBuffer} schema Special case: schema is an ArrayBuffer
	 */
	fromSchema(schema)
	{
		//region Check the schema is valid
		if((schema instanceof ArrayBuffer) === false)
			throw new Error("Object's schema was not verified against input data for ECPublicKey");

		const view = new Uint8Array(schema);
		if(view[0] !== 0x04)
			throw new Error("Object's schema was not verified against input data for ECPublicKey");
		//endregion

		//region Get internal properties from parsed schema
		let coordinateLength;

		switch(this.namedCurve)
		{
			case "1.2.840.10045.3.1.7": // P-256
				coordinateLength = 32;
				break;
			case "1.3.132.0.34": // P-384
				coordinateLength = 48;
				break;
			case "1.3.132.0.35": // P-521
				coordinateLength = 66;
				break;
			default:
				throw new Error(`Incorrect curve OID: ${this.namedCurve}`);
		}

		if(schema.byteLength !== (coordinateLength * 2 + 1))
			throw new Error("Object's schema was not verified against input data for ECPublicKey");
		
		this.x = schema.slice(1, coordinateLength + 1);
		this.y = schema.slice(1 + coordinateLength, coordinateLength * 2 + 1);
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convert current object to asn1js object and set correct values
	 * @returns {Object} asn1js object
	 */
	toSchema()
	{
		return new __WEBPACK_IMPORTED_MODULE_0_asn1js__["RawData"]({ data: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["utilConcatBuf"])(
			(new Uint8Array([0x04])).buffer,
			this.x,
			this.y
		)
		});
	}
	//**********************************************************************************
	/**
	 * Convertion for the class to JSON object
	 * @returns {Object}
	 */
	toJSON()
	{
		let crvName = "";

		switch(this.namedCurve)
		{
			case "1.2.840.10045.3.1.7": // P-256
				crvName = "P-256";
				break;
			case "1.3.132.0.34": // P-384
				crvName = "P-384";
				break;
			case "1.3.132.0.35": // P-521
				crvName = "P-521";
				break;
			default:
		}

		return {
			crv: crvName,
			x: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["toBase64"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["arrayBufferToString"])(this.x), true, true, false),
			y: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["toBase64"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["arrayBufferToString"])(this.y), true, true, false)
		};
	}
	//**********************************************************************************
	/**
	 * Convert JSON value into current object
	 * @param {Object} json
	 */
	fromJSON(json)
	{
		let coodinateLength = 0;

		if("crv" in json)
		{
			switch(json.crv.toUpperCase())
			{
				case "P-256":
					this.namedCurve = "1.2.840.10045.3.1.7";
					coodinateLength = 32;
					break;
				case "P-384":
					this.namedCurve = "1.3.132.0.34";
					coodinateLength = 48;
					break;
				case "P-521":
					this.namedCurve = "1.3.132.0.35";
					coodinateLength = 66;
					break;
				default:
			}
		}
		else
			throw new Error("Absent mandatory parameter \"crv\"");

		if("x" in json)
		{
			const convertBuffer = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["stringToArrayBuffer"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["fromBase64"])(json.x, true));
			
			if(convertBuffer.byteLength < coodinateLength)
			{
				this.x = new ArrayBuffer(coodinateLength);
				const view = new Uint8Array(this.x);
				const convertBufferView = new Uint8Array(convertBuffer);
				view.set(convertBufferView, 1);
			}
			else
				this.x = convertBuffer.slice(0, coodinateLength);
		}
		else
			throw new Error("Absent mandatory parameter \"x\"");

		if("y" in json)
		{
			const convertBuffer = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["stringToArrayBuffer"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["fromBase64"])(json.y, true));
			
			if(convertBuffer.byteLength < coodinateLength)
			{
				this.y = new ArrayBuffer(coodinateLength);
				const view = new Uint8Array(this.y);
				const convertBufferView = new Uint8Array(convertBuffer);
				view.set(convertBufferView, 1);
			}
			else
				this.y = convertBuffer.slice(0, coodinateLength);
		}
		else
			throw new Error("Absent mandatory parameter \"y\"");
	}
	//**********************************************************************************
}/* harmony export */ exports["a"] = ECPublicKey;
//**************************************************************************************


/***/ },

/***/ "./node_modules/pkijs/src/EncryptedContentInfo.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js__ = __webpack_require__("./node_modules/asn1js/build/asn1.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_asn1js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pvutils__ = __webpack_require__("./node_modules/pvutils/src/utils.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__AlgorithmIdentifier_js__ = __webpack_require__("./node_modules/pkijs/src/AlgorithmIdentifier.js");



//**************************************************************************************
/**
 * Class from RFC5652
 */
class EncryptedContentInfo
{
	//**********************************************************************************
	/**
	 * Constructor for EncryptedContentInfo class
	 * @param {Object} [parameters={}]
	 * @param {Object} [parameters.schema] asn1js parsed value to initialize the class from
	 */
	constructor(parameters = {})
	{
		//region Internal properties of the object
		/**
		 * @type {string}
		 * @desc contentType
		 */
		this.contentType = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "contentType", EncryptedContentInfo.defaultValues("contentType"));
		/**
		 * @type {AlgorithmIdentifier}
		 * @desc contentEncryptionAlgorithm
		 */
		this.contentEncryptionAlgorithm = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "contentEncryptionAlgorithm", EncryptedContentInfo.defaultValues("contentEncryptionAlgorithm"));

		if("encryptedContent" in parameters)
		{
			/**
			 * @type {OctetString}
			 * @desc encryptedContent (!!!) could be contructive or primitive value (!!!)
			 */
			this.encryptedContent = parameters.encryptedContent;
			
			if((this.encryptedContent.idBlock.tagClass === 1) &&
				(this.encryptedContent.idBlock.tagNumber === 4))
			{
				//region Divide OCTETSTRING value down to small pieces
				if(this.encryptedContent.idBlock.isConstructed === false)
				{
					const constrString = new __WEBPACK_IMPORTED_MODULE_0_asn1js__["OctetString"]({
						idBlock: { isConstructed: true },
						isConstructed: true
					});
					
					let offset = 0;
					let length = this.encryptedContent.valueBlock.valueHex.byteLength;
					
					while(length > 0)
					{
						const pieceView = new Uint8Array(this.encryptedContent.valueBlock.valueHex, offset, ((offset + 1024) > this.encryptedContent.valueBlock.valueHex.byteLength) ? (this.encryptedContent.valueBlock.valueHex.byteLength - offset) : 1024);
						const _array = new ArrayBuffer(pieceView.length);
						const _view = new Uint8Array(_array);
						
						for(let i = 0; i < _view.length; i++)
							_view[i] = pieceView[i];
						
						constrString.valueBlock.value.push(new __WEBPACK_IMPORTED_MODULE_0_asn1js__["OctetString"]({ valueHex: _array }));
						
						length -= pieceView.length;
						offset += pieceView.length;
					}
					
					this.encryptedContent = constrString;
				}
				//endregion
			}
		}
		//endregion

		//region If input argument array contains "schema" for this object
		if("schema" in parameters)
			this.fromSchema(parameters.schema);
		//endregion
	}
	//**********************************************************************************
	/**
	 * Return default values for all class members
	 * @param {string} memberName String name for a class member
	 */
	static defaultValues(memberName)
	{
		switch(memberName)
		{
			case "contentType":
				return "";
			case "contentEncryptionAlgorithm":
				return new __WEBPACK_IMPORTED_MODULE_2__AlgorithmIdentifier_js__["a" /* default */]();
			case "encryptedContent":
				return new __WEBPACK_IMPORTED_MODULE_0_asn1js__["OctetString"]();
			default:
				throw new Error(`Invalid member name for EncryptedContentInfo class: ${memberName}`);
		}
	}
	//**********************************************************************************
	/**
	 * Compare values with default values for all class members
	 * @param {string} memberName String name for a class member
	 * @param {*} memberValue Value to compare with default value
	 */
	static compareWithDefault(memberName, memberValue)
	{
		switch(memberName)
		{
			case "contentType":
				return (memberValue === "");
			case "contentEncryptionAlgorithm":
				return ((memberValue.algorithmId === "") && (("algorithmParams" in memberValue) === false));
			case "encryptedContent":
				return (memberValue.isEqual(EncryptedContentInfo.defaultValues(memberName)));
			default:
				throw new Error(`Invalid member name for EncryptedContentInfo class: ${memberName}`);
		}
	}
	//**********************************************************************************
	/**
	 * Return value of pre-defined ASN.1 schema for current class
	 *
	 * ASN.1 schema:
	 * ```asn1
	 * EncryptedContentInfo ::= SEQUENCE {
	 *    contentType ContentType,
	 *    contentEncryptionAlgorithm ContentEncryptionAlgorithmIdentifier,
	 *    encryptedContent [0] IMPLICIT EncryptedContent OPTIONAL }
	 *
	 * Comment: Strange, but modern crypto engines create "encryptedContent" as "[0] EXPLICIT EncryptedContent"
	 *
	 * EncryptedContent ::= OCTET STRING
	 * ```
	 *
	 * @param {Object} parameters Input parameters for the schema
	 * @returns {Object} asn1js schema object
	 */
	static schema(parameters = {})
	{
		/**
		 * @type {Object}
		 * @property {string} [blockName]
		 * @property {string} [contentType]
		 * @property {string} [contentEncryptionAlgorithm]
		 * @property {string} [encryptedContent]
		 */
		const names = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "names", {});

		return (new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
			name: (names.blockName || ""),
			value: [
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["ObjectIdentifier"]({ name: (names.contentType || "") }),
				__WEBPACK_IMPORTED_MODULE_2__AlgorithmIdentifier_js__["a" /* default */].schema(names.contentEncryptionAlgorithm || {}),
				// The CHOICE we need because "EncryptedContent" could have either "constructive"
				// or "primitive" form of encoding and we need to handle both variants
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Choice"]({
					value: [
						new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Constructed"]({
							name: (names.encryptedContent || ""),
							idBlock: {
								tagClass: 3, // CONTEXT-SPECIFIC
								tagNumber: 0 // [0]
							},
							value: [
								new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Repeated"]({
									value: new __WEBPACK_IMPORTED_MODULE_0_asn1js__["OctetString"]()
								})
							]
						}),
						new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Primitive"]({
							name: (names.encryptedContent || ""),
							idBlock: {
								tagClass: 3, // CONTEXT-SPECIFIC
								tagNumber: 0 // [0]
							}
						})
					]
				})
			]
		}));
	}
	//**********************************************************************************
	/**
	 * Convert parsed asn1js object into current class
	 * @param {!Object} schema
	 */
	fromSchema(schema)
	{
		//region Clear input data first
		__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["clearProps"])(schema, [
			"contentType",
			"contentEncryptionAlgorithm",
			"encryptedContent"
		]);
		//endregion
		
		//region Check the schema is valid
		const asn1 = __WEBPACK_IMPORTED_MODULE_0_asn1js__["compareSchema"](schema,
			schema,
			EncryptedContentInfo.schema({
				names: {
					contentType: "contentType",
					contentEncryptionAlgorithm: {
						names: {
							blockName: "contentEncryptionAlgorithm"
						}
					},
					encryptedContent: "encryptedContent"
				}
			})
		);

		if(asn1.verified === false)
			throw new Error("Object's schema was not verified against input data for EncryptedContentInfo");
		//endregion

		//region Get internal properties from parsed schema
		this.contentType = asn1.result.contentType.valueBlock.toString();
		this.contentEncryptionAlgorithm = new __WEBPACK_IMPORTED_MODULE_2__AlgorithmIdentifier_js__["a" /* default */]({ schema: asn1.result.contentEncryptionAlgorithm });

		if("encryptedContent" in asn1.result)
		{
			this.encryptedContent = asn1.result.encryptedContent;

			this.encryptedContent.idBlock.tagClass = 1; // UNIVERSAL
			this.encryptedContent.idBlock.tagNumber = 4; // OCTETSTRING (!!!) The value still has instance of "in_window.org.pkijs.asn1.ASN1_CONSTRUCTED / ASN1_PRIMITIVE"
		}
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convert current object to asn1js object and set correct values
	 * @returns {Object} asn1js object
	 */
	toSchema()
	{
		//region Create array for output sequence
		const sequenceLengthBlock = {
			isIndefiniteForm: false
		};

		const outputArray = [];

		outputArray.push(new __WEBPACK_IMPORTED_MODULE_0_asn1js__["ObjectIdentifier"]({ value: this.contentType }));
		outputArray.push(this.contentEncryptionAlgorithm.toSchema());

		if("encryptedContent" in this)
		{
			sequenceLengthBlock.isIndefiniteForm = this.encryptedContent.idBlock.isConstructed;

			const encryptedValue = this.encryptedContent;

			encryptedValue.idBlock.tagClass = 3; // CONTEXT-SPECIFIC
			encryptedValue.idBlock.tagNumber = 0; // [0]

			encryptedValue.lenBlock.isIndefiniteForm = this.encryptedContent.idBlock.isConstructed;

			outputArray.push(encryptedValue);
		}
		//endregion

		//region Construct and return new ASN.1 schema for this object
		return (new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
			lenBlock: sequenceLengthBlock,
			value: outputArray
		}));
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convertion for the class to JSON object
	 * @returns {Object}
	 */
	toJSON()
	{
		const _object = {
			contentType: this.contentType,
			contentEncryptionAlgorithm: this.contentEncryptionAlgorithm.toJSON()
		};

		if("encryptedContent" in this)
			_object.encryptedContent = this.encryptedContent.toJSON();

		return _object;
	}
	//**********************************************************************************
}/* harmony export */ exports["a"] = EncryptedContentInfo;
//**************************************************************************************


/***/ },

/***/ "./node_modules/pkijs/src/OtherPrimeInfo.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js__ = __webpack_require__("./node_modules/asn1js/build/asn1.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_asn1js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pvutils__ = __webpack_require__("./node_modules/pvutils/src/utils.js");


//**************************************************************************************
/**
 * Class from RFC3447
 */
class OtherPrimeInfo
{
	//**********************************************************************************
	/**
	 * Constructor for OtherPrimeInfo class
	 * @param {Object} [parameters={}]
	 * @param {Object} [parameters.schema] asn1js parsed value to initialize the class from
	 */
	constructor(parameters = {})
	{
		//region Internal properties of the object
		/**
		 * @type {Integer}
		 * @desc prime
		 */
		this.prime = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "prime", OtherPrimeInfo.defaultValues("prime"));
		/**
		 * @type {Integer}
		 * @desc exponent
		 */
		this.exponent = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "exponent", OtherPrimeInfo.defaultValues("exponent"));
		/**
		 * @type {Integer}
		 * @desc coefficient
		 */
		this.coefficient = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "coefficient", OtherPrimeInfo.defaultValues("coefficient"));
		//endregion

		//region If input argument array contains "schema" for this object
		if("schema" in parameters)
			this.fromSchema(parameters.schema);
		//endregion
		//region If input argument array contains "json" for this object
		if("json" in parameters)
			this.fromJSON(parameters.json);
		//endregion
	}
	//**********************************************************************************
	/**
	 * Return default values for all class members
	 * @param {string} memberName String name for a class member
	 */
	static defaultValues(memberName)
	{
		switch(memberName)
		{
			case "prime":
				return new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]();
			case "exponent":
				return new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]();
			case "coefficient":
				return new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]();
			default:
				throw new Error(`Invalid member name for OtherPrimeInfo class: ${memberName}`);
		}
	}
	//**********************************************************************************
	/**
	 * Return value of pre-defined ASN.1 schema for current class
	 *
	 * ASN.1 schema:
	 * ```asn1
	 * OtherPrimeInfo ::= Sequence {
	 *    prime             Integer,  -- ri
	 *    exponent          Integer,  -- di
	 *    coefficient       Integer   -- ti
	 * }
	 * ```
	 *
	 * @param {Object} parameters Input parameters for the schema
	 * @returns {Object} asn1js schema object
	 */
	static schema(parameters = {})
	{

		/**
		 * @type {Object}
		 * @property {string} prime
		 * @property {string} exponent
		 * @property {string} coefficient
		 */
		const names = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "names", {});

		return (new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
			name: (names.blockName || ""),
			value: [
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ name: (names.prime || "") }),
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ name: (names.exponent || "") }),
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ name: (names.coefficient || "") })
			]
		}));
	}
	//**********************************************************************************
	/**
	 * Convert parsed asn1js object into current class
	 * @param {!Object} schema
	 */
	fromSchema(schema)
	{
		//region Clear input data first
		__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["clearProps"])(schema, [
			"prime",
			"exponent",
			"coefficient"
		]);
		//endregion
		
		//region Check the schema is valid
		const asn1 = __WEBPACK_IMPORTED_MODULE_0_asn1js__["compareSchema"](schema,
			schema,
			OtherPrimeInfo.schema({
				names: {
					prime: "prime",
					exponent: "exponent",
					coefficient: "coefficient"
				}
			})
		);

		if(asn1.verified === false)
			throw new Error("Object's schema was not verified against input data for OtherPrimeInfo");
		//endregion

		//region Get internal properties from parsed schema
		this.prime = asn1.result.prime.convertFromDER();
		this.exponent = asn1.result.exponent.convertFromDER();
		this.coefficient = asn1.result.coefficient.convertFromDER();
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convert current object to asn1js object and set correct values
	 * @returns {Object} asn1js object
	 */
	toSchema()
	{
		//region Construct and return new ASN.1 schema for this object
		return (new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
			value: [
				this.prime.convertToDER(),
				this.exponent.convertToDER(),
				this.coefficient.convertToDER()
			]
		}));
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convertion for the class to JSON object
	 * @returns {Object}
	 */
	toJSON()
	{
		return {
			r: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["toBase64"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["arrayBufferToString"])(this.prime.valueBlock.valueHex), true, true),
			d: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["toBase64"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["arrayBufferToString"])(this.exponent.valueBlock.valueHex), true, true),
			t: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["toBase64"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["arrayBufferToString"])(this.coefficient.valueBlock.valueHex), true, true)
		};
	}
	//**********************************************************************************
	/**
	 * Convert JSON value into current object
	 * @param {Object} json
	 */
	fromJSON(json)
	{
		if("r" in json)
			this.prime = new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ valueHex: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["stringToArrayBuffer"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["fromBase64"])(json.r, true)) });
		else
			throw new Error("Absent mandatory parameter \"r\"");

		if("d" in json)
			this.exponent = new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ valueHex: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["stringToArrayBuffer"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["fromBase64"])(json.d, true)) });
		else
			throw new Error("Absent mandatory parameter \"d\"");

		if("t" in json)
			this.coefficient = new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ valueHex: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["stringToArrayBuffer"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["fromBase64"])(json.t, true)) });
		else
			throw new Error("Absent mandatory parameter \"t\"");
	}
	//**********************************************************************************
}/* harmony export */ exports["a"] = OtherPrimeInfo;
//**************************************************************************************


/***/ },

/***/ "./node_modules/pkijs/src/PBES2Params.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js__ = __webpack_require__("./node_modules/asn1js/build/asn1.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_asn1js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pvutils__ = __webpack_require__("./node_modules/pvutils/src/utils.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__AlgorithmIdentifier_js__ = __webpack_require__("./node_modules/pkijs/src/AlgorithmIdentifier.js");



//**************************************************************************************
/**
 * Class from RFC2898
 */
class PBES2Params
{
	//**********************************************************************************
	/**
	 * Constructor for PBES2Params class
	 * @param {Object} [parameters={}]
	 * @param {Object} [parameters.schema] asn1js parsed value to initialize the class from
	 */
	constructor(parameters = {})
	{
		//region Internal properties of the object
		/**
		 * @type {AlgorithmIdentifier}
		 * @desc keyDerivationFunc
		 */
		this.keyDerivationFunc = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "keyDerivationFunc", PBES2Params.defaultValues("keyDerivationFunc"));
		/**
		 * @type {AlgorithmIdentifier}
		 * @desc encryptionScheme
		 */
		this.encryptionScheme = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "encryptionScheme", PBES2Params.defaultValues("encryptionScheme"));
		//endregion

		//region If input argument array contains "schema" for this object
		if("schema" in parameters)
			this.fromSchema(parameters.schema);
		//endregion
	}
	//**********************************************************************************
	/**
	 * Return default values for all class members
	 * @param {string} memberName String name for a class member
	 */
	static defaultValues(memberName)
	{
		switch(memberName)
		{
			case "keyDerivationFunc":
				return new __WEBPACK_IMPORTED_MODULE_2__AlgorithmIdentifier_js__["a" /* default */]();
			case "encryptionScheme":
				return new __WEBPACK_IMPORTED_MODULE_2__AlgorithmIdentifier_js__["a" /* default */]();
			default:
				throw new Error(`Invalid member name for PBES2Params class: ${memberName}`);
		}
	}
	//**********************************************************************************
	/**
	 * Return value of pre-defined ASN.1 schema for current class
	 *
	 * ASN.1 schema:
	 * ```asn1
	 * PBES2-params ::= SEQUENCE {
	 *    keyDerivationFunc AlgorithmIdentifier {{PBES2-KDFs}},
	 *    encryptionScheme AlgorithmIdentifier {{PBES2-Encs}} }
	 * ```
	 *
	 * @param {Object} parameters Input parameters for the schema
	 * @returns {Object} asn1js schema object
	 */
	static schema(parameters = {})
	{
		/**
		 * @type {Object}
		 * @property {string} [blockName]
		 * @property {string} [keyDerivationFunc]
		 * @property {string} [encryptionScheme]
		 */
		const names = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "names", {});

		return (new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
			name: (names.blockName || ""),
			value: [
				__WEBPACK_IMPORTED_MODULE_2__AlgorithmIdentifier_js__["a" /* default */].schema(names.keyDerivationFunc || {}),
				__WEBPACK_IMPORTED_MODULE_2__AlgorithmIdentifier_js__["a" /* default */].schema(names.encryptionScheme || {})
			]
		}));
	}
	//**********************************************************************************
	/**
	 * Convert parsed asn1js object into current class
	 * @param {!Object} schema
	 */
	fromSchema(schema)
	{
		//region Clear input data first
		__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["clearProps"])(schema, [
			"keyDerivationFunc",
			"encryptionScheme"
		]);
		//endregion
		
		//region Check the schema is valid
		const asn1 = __WEBPACK_IMPORTED_MODULE_0_asn1js__["compareSchema"](schema,
			schema,
			PBES2Params.schema({
				names: {
					keyDerivationFunc: {
						names: {
							blockName: "keyDerivationFunc"
						}
					},
					encryptionScheme: {
						names: {
							blockName: "encryptionScheme"
						}
					}
				}
			})
		);

		if(asn1.verified === false)
			throw new Error("Object's schema was not verified against input data for PBES2Params");
		//endregion

		//region Get internal properties from parsed schema
		this.keyDerivationFunc = new __WEBPACK_IMPORTED_MODULE_2__AlgorithmIdentifier_js__["a" /* default */]({ schema: asn1.result.keyDerivationFunc });
		this.encryptionScheme = new __WEBPACK_IMPORTED_MODULE_2__AlgorithmIdentifier_js__["a" /* default */]({ schema: asn1.result.encryptionScheme });
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convert current object to asn1js object and set correct values
	 * @returns {Object} asn1js object
	 */
	toSchema()
	{
		//region Construct and return new ASN.1 schema for this object
		return (new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
			value: [
				this.keyDerivationFunc.toSchema(),
				this.encryptionScheme.toSchema()
			]
		}));
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convertion for the class to JSON object
	 * @returns {Object}
	 */
	toJSON()
	{
		return {
			keyDerivationFunc: this.keyDerivationFunc.toJSON(),
			encryptionScheme: this.encryptionScheme.toJSON()
		};
	}
	//**********************************************************************************
}/* harmony export */ exports["a"] = PBES2Params;
//**************************************************************************************


/***/ },

/***/ "./node_modules/pkijs/src/PBKDF2Params.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js__ = __webpack_require__("./node_modules/asn1js/build/asn1.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_asn1js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pvutils__ = __webpack_require__("./node_modules/pvutils/src/utils.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__AlgorithmIdentifier_js__ = __webpack_require__("./node_modules/pkijs/src/AlgorithmIdentifier.js");



//**************************************************************************************
/**
 * Class from RFC2898
 */
class PBKDF2Params
{
	//**********************************************************************************
	/**
	 * Constructor for PBKDF2Params class
	 * @param {Object} [parameters={}]
	 * @param {Object} [parameters.schema] asn1js parsed value to initialize the class from
	 */
	constructor(parameters = {})
	{
		//region Internal properties of the object
		/**
		 * @type {Object}
		 * @desc salt
		 */
		this.salt = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "salt", PBKDF2Params.defaultValues("salt"));
		/**
		 * @type {number}
		 * @desc iterationCount
		 */
		this.iterationCount = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "iterationCount", PBKDF2Params.defaultValues("iterationCount"));
		
		if("keyLength" in parameters)
			/**
			 * @type {number}
			 * @desc keyLength
			 */
			this.keyLength = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "keyLength", PBKDF2Params.defaultValues("keyLength"));
		
		if("prf" in parameters)
			/**
			 * @type {AlgorithmIdentifier}
			 * @desc prf
			 */
			this.prf = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "prf", PBKDF2Params.defaultValues("prf"));
		//endregion

		//region If input argument array contains "schema" for this object
		if("schema" in parameters)
			this.fromSchema(parameters.schema);
		//endregion
	}
	//**********************************************************************************
	/**
	 * Return default values for all class members
	 * @param {string} memberName String name for a class member
	 */
	static defaultValues(memberName)
	{
		switch(memberName)
		{
			case "salt":
				return {};
			case "iterationCount":
				return (-1);
			case "keyLength":
				return 0;
			case "prf":
				return new __WEBPACK_IMPORTED_MODULE_2__AlgorithmIdentifier_js__["a" /* default */]({
					algorithmId: "1.3.14.3.2.26", // SHA-1
					algorithmParams: new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Null"]()
				});
			default:
				throw new Error(`Invalid member name for PBKDF2Params class: ${memberName}`);
		}
	}
	//**********************************************************************************
	/**
	 * Return value of pre-defined ASN.1 schema for current class
	 *
	 * ASN.1 schema:
	 * ```asn1
	 * PBKDF2-params ::= SEQUENCE {
	 *    salt CHOICE {
	 *        specified OCTET STRING,
	 *        otherSource AlgorithmIdentifier },
	 *  iterationCount INTEGER (1..MAX),
	 *  keyLength INTEGER (1..MAX) OPTIONAL,
	 *  prf AlgorithmIdentifier
	 *    DEFAULT { algorithm hMAC-SHA1, parameters NULL } }
	 * ```
	 *
	 * @param {Object} parameters Input parameters for the schema
	 * @returns {Object} asn1js schema object
	 */
	static schema(parameters = {})
	{
		/**
		 * @type {Object}
		 * @property {string} [blockName]
		 * @property {string} [saltPrimitive]
		 * @property {string} [saltConstructed]
		 * @property {string} [iterationCount]
		 * @property {string} [keyLength]
		 * @property {string} [prf]
		 */
		const names = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "names", {});

		return (new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
			name: (names.blockName || ""),
			value: [
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Choice"]({
					value: [
						new __WEBPACK_IMPORTED_MODULE_0_asn1js__["OctetString"]({ name: (names.saltPrimitive || "") }),
						__WEBPACK_IMPORTED_MODULE_2__AlgorithmIdentifier_js__["a" /* default */].schema(names.saltConstructed || {})
					]
				}),
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ name: (names.iterationCount || "") }),
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({
					name: (names.keyLength || ""),
					optional: true
				}),
				__WEBPACK_IMPORTED_MODULE_2__AlgorithmIdentifier_js__["a" /* default */].schema(names.prf || {
					names: {
						optional: true
					}
				})
			]
		}));
	}
	//**********************************************************************************
	/**
	 * Convert parsed asn1js object into current class
	 * @param {!Object} schema
	 */
	fromSchema(schema)
	{
		//region Clear input data first
		__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["clearProps"])(schema, [
			"salt",
			"iterationCount",
			"keyLength",
			"prf"
		]);
		//endregion
		
		//region Check the schema is valid
		const asn1 = __WEBPACK_IMPORTED_MODULE_0_asn1js__["compareSchema"](schema,
			schema,
			PBKDF2Params.schema({
				names: {
					saltPrimitive: "salt",
					saltConstructed: {
						names: {
							blockName: "salt"
						}
					},
					iterationCount: "iterationCount",
					keyLength: "keyLength",
					prf: {
						names: {
							blockName: "prf",
							optional: true
						}
					}
				}
			})
		);

		if(asn1.verified === false)
			throw new Error("Object's schema was not verified against input data for PBKDF2Params");
		//endregion

		//region Get internal properties from parsed schema
		this.salt = asn1.result.salt;
		this.iterationCount = asn1.result.iterationCount.valueBlock.valueDec;

		if("keyLength" in asn1.result)
			this.keyLength = asn1.result.keyLength.valueBlock.valueDec;

		if("prf" in asn1.result)
			this.prf = new __WEBPACK_IMPORTED_MODULE_2__AlgorithmIdentifier_js__["a" /* default */]({ schema: asn1.result.prf });
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convert current object to asn1js object and set correct values
	 * @returns {Object} asn1js object
	 */
	toSchema()
	{
		//region Create array for output sequence 
		const outputArray = [];
		
		outputArray.push(this.salt);
		outputArray.push(new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ value: this.iterationCount }));
		
		if("keyLength" in this)
		{
			if(PBKDF2Params.defaultValues("keyLength") !== this.keyLength)
				outputArray.push(new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ value: this.keyLength }));
		}
		
		if("prf" in this)
		{
			if(PBKDF2Params.defaultValues("prf").isEqual(this.prf) === false)
				outputArray.push(this.prf.toSchema());
		}
		//endregion 
		
		//region Construct and return new ASN.1 schema for this object 
		return (new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
			value: outputArray
		}));
		//endregion 
	}
	//**********************************************************************************
	/**
	 * Convertion for the class to JSON object
	 * @returns {Object}
	 */
	toJSON()
	{
		const _object = {
			salt: this.salt.toJSON(),
			iterationCount: this.iterationCount
		};
		
		if("keyLength" in this)
		{
			if(PBKDF2Params.defaultValues("keyLength") !== this.keyLength)
				_object.keyLength = this.keyLength;
		}
		
		if("prf" in this)
		{
			if(PBKDF2Params.defaultValues("prf").isEqual(this.prf) === false)
				_object.prf = this.prf.toJSON();
		}

		return _object;
	}
	//**********************************************************************************
}/* harmony export */ exports["a"] = PBKDF2Params;
//**************************************************************************************


/***/ },

/***/ "./node_modules/pkijs/src/PrivateKeyInfo.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js__ = __webpack_require__("./node_modules/asn1js/build/asn1.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_asn1js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pvutils__ = __webpack_require__("./node_modules/pvutils/src/utils.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__AlgorithmIdentifier_js__ = __webpack_require__("./node_modules/pkijs/src/AlgorithmIdentifier.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Attribute_js__ = __webpack_require__("./node_modules/pkijs/src/Attribute.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ECPrivateKey_js__ = __webpack_require__("./node_modules/pkijs/src/ECPrivateKey.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__RSAPrivateKey_js__ = __webpack_require__("./node_modules/pkijs/src/RSAPrivateKey.js");






//**************************************************************************************
/**
 * Class from RFC5208
 */
class PrivateKeyInfo
{
	//**********************************************************************************
	/**
	 * Constructor for PrivateKeyInfo class
	 * @param {Object} [parameters={}]
	 * @param {Object} [parameters.schema] asn1js parsed value to initialize the class from
	 */
	constructor(parameters = {})
	{
		//region Internal properties of the object
		/**
		 * @type {number}
		 * @desc version
		 */
		this.version = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "version", PrivateKeyInfo.defaultValues("version"));
		/**
		 * @type {AlgorithmIdentifier}
		 * @desc privateKeyAlgorithm
		 */
		this.privateKeyAlgorithm = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "privateKeyAlgorithm", PrivateKeyInfo.defaultValues("privateKeyAlgorithm"));
		/**
		 * @type {OctetString}
		 * @desc privateKey
		 */
		this.privateKey = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "privateKey", PrivateKeyInfo.defaultValues("privateKey"));

		if("attributes" in parameters)
			/**
			 * @type {Array.<Attribute>}
			 * @desc attributes
			 */
			this.attributes = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "attributes", PrivateKeyInfo.defaultValues("attributes"));

		if("parsedKey" in parameters)
			/**
			 * @type {ECPrivateKey|RSAPrivateKey}
			 * @desc Parsed public key value
			 */
			this.parsedKey = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "parsedKey", PrivateKeyInfo.defaultValues("parsedKey"));
		//endregion

		//region If input argument array contains "schema" for this object
		if("schema" in parameters)
			this.fromSchema(parameters.schema);
		//endregion
		//region If input argument array contains "json" for this object
		if("json" in parameters)
			this.fromJSON(parameters.json);
		//endregion
	}
	//**********************************************************************************
	/**
	 * Return default values for all class members
	 * @param {string} memberName String name for a class member
	 */
	static defaultValues(memberName)
	{
		switch(memberName)
		{
			case "version":
				return 0;
			case "privateKeyAlgorithm":
				return new __WEBPACK_IMPORTED_MODULE_2__AlgorithmIdentifier_js__["a" /* default */]();
			case "privateKey":
				return new __WEBPACK_IMPORTED_MODULE_0_asn1js__["OctetString"]();
			case "attributes":
				return [];
			case "parsedKey":
				return {};
			default:
				throw new Error(`Invalid member name for PrivateKeyInfo class: ${memberName}`);
		}
	}
	//**********************************************************************************
	/**
	 * Return value of pre-defined ASN.1 schema for current class
	 *
	 * ASN.1 schema:
	 * ```asn1
	 * PrivateKeyInfo ::= SEQUENCE {
	 *    version Version,
	 *    privateKeyAlgorithm AlgorithmIdentifier {{PrivateKeyAlgorithms}},
	 *    privateKey PrivateKey,
	 *    attributes [0] Attributes OPTIONAL }
	 *
	 * Version ::= INTEGER {v1(0)} (v1,...)
	 *
	 * PrivateKey ::= OCTET STRING
	 *
	 * Attributes ::= SET OF Attribute
	 * ```
	 *
	 * @param {Object} parameters Input parameters for the schema
	 * @returns {Object} asn1js schema object
	 */
	static schema(parameters = {})
	{
		/**
		 * @type {Object}
		 * @property {string} [blockName]
		 * @property {string} [version]
		 * @property {string} [privateKeyAlgorithm]
		 * @property {string} [privateKey]
		 * @property {string} [attributes]
		 */
		const names = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "names", {});

		return (new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
			name: (names.blockName || ""),
			value: [
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ name: (names.version || "") }),
				__WEBPACK_IMPORTED_MODULE_2__AlgorithmIdentifier_js__["a" /* default */].schema(names.privateKeyAlgorithm || {}),
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["OctetString"]({ name: (names.privateKey || "") }),
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Constructed"]({
					optional: true,
					idBlock: {
						tagClass: 3, // CONTEXT-SPECIFIC
						tagNumber: 0 // [0]
					},
					value: [
						new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Repeated"]({
							name: (names.attributes || ""),
							value: __WEBPACK_IMPORTED_MODULE_3__Attribute_js__["a" /* default */].schema()
						})
					]
				})
			]
		}));
	}
	//**********************************************************************************
	/**
	 * Convert parsed asn1js object into current class
	 * @param {!Object} schema
	 */
	fromSchema(schema)
	{
		//region Clear input data first
		__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["clearProps"])(schema, [
			"version",
			"privateKeyAlgorithm",
			"privateKey",
			"attributes"
		]);
		//endregion
		
		//region Check the schema is valid
		const asn1 = __WEBPACK_IMPORTED_MODULE_0_asn1js__["compareSchema"](schema,
			schema,
			PrivateKeyInfo.schema({
				names: {
					version: "version",
					privateKeyAlgorithm: {
						names: {
							blockName: "privateKeyAlgorithm"
						}
					},
					privateKey: "privateKey",
					attributes: "attributes"
				}
			})
		);

		if(asn1.verified === false)
			throw new Error("Object's schema was not verified against input data for PrivateKeyInfo");
		//endregion

		//region Get internal properties from parsed schema
		this.version = asn1.result.version.valueBlock.valueDec;
		this.privateKeyAlgorithm = new __WEBPACK_IMPORTED_MODULE_2__AlgorithmIdentifier_js__["a" /* default */]({ schema: asn1.result.privateKeyAlgorithm });
		this.privateKey = asn1.result.privateKey;

		if("attributes" in asn1.result)
			this.attributes = Array.from(asn1.result.attributes, element => new __WEBPACK_IMPORTED_MODULE_3__Attribute_js__["a" /* default */]({ schema: element }));

		switch(this.privateKeyAlgorithm.algorithmId)
		{
			case "1.2.840.113549.1.1.1": // RSA
				{
					const privateKeyASN1 = __WEBPACK_IMPORTED_MODULE_0_asn1js__["fromBER"](this.privateKey.valueBlock.valueHex);
					if(privateKeyASN1.offset !== (-1))
						this.parsedKey = new __WEBPACK_IMPORTED_MODULE_5__RSAPrivateKey_js__["a" /* default */]({ schema: privateKeyASN1.result });
				}
				break;
			case "1.2.840.10045.2.1": // ECDSA
				if("algorithmParams" in this.privateKeyAlgorithm)
				{
					if(this.privateKeyAlgorithm.algorithmParams instanceof __WEBPACK_IMPORTED_MODULE_0_asn1js__["ObjectIdentifier"])
					{
						const privateKeyASN1 = __WEBPACK_IMPORTED_MODULE_0_asn1js__["fromBER"](this.privateKey.valueBlock.valueHex);
						if(privateKeyASN1.offset !== (-1))
						{
							this.parsedKey = new __WEBPACK_IMPORTED_MODULE_4__ECPrivateKey_js__["a" /* default */]({
								namedCurve: this.privateKeyAlgorithm.algorithmParams.valueBlock.toString(),
								schema: privateKeyASN1.result
							});
						}
					}
				}
				break;
			default:
		}
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convert current object to asn1js object and set correct values
	 * @returns {Object} asn1js object
	 */
	toSchema()
	{
		//region Create array for output sequence
		const outputArray = [
			new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ value: this.version }),
			this.privateKeyAlgorithm.toSchema(),
			this.privateKey
		];

		if("attributes" in this)
		{
			outputArray.push(new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Constructed"]({
				optional: true,
				idBlock: {
					tagClass: 3, // CONTEXT-SPECIFIC
					tagNumber: 0 // [0]
				},
				value: Array.from(this.attributes, element => element.toSchema())
			}));
		}
		//endregion
		
		//region Construct and return new ASN.1 schema for this object
		return (new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
			value: outputArray
		}));
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convertion for the class to JSON object
	 * @returns {Object}
	 */
	toJSON()
	{
		//region Return common value in case we do not have enough info fo making JWK
		if(("parsedKey" in this) === false)
		{
			const object = {
				version: this.version,
				privateKeyAlgorithm: this.privateKeyAlgorithm.toJSON(),
				privateKey: this.privateKey.toJSON()
			};

			if("attributes" in this)
				object.attributes = Array.from(this.attributes, element => element.toJSON());

			return object;
		}
		//endregion

		//region Making JWK
		const jwk = {};

		switch(this.privateKeyAlgorithm.algorithmId)
		{
			case "1.2.840.10045.2.1": // ECDSA
				jwk.kty = "EC";
				break;
			case "1.2.840.113549.1.1.1": // RSA
				jwk.kty = "RSA";
				break;
			default:
		}

		const publicKeyJWK = this.parsedKey.toJSON();

		for(const key of Object.keys(publicKeyJWK))
			jwk[key] = publicKeyJWK[key];

		return jwk;
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convert JSON value into current object
	 * @param {Object} json
	 */
	fromJSON(json)
	{
		if("kty" in json)
		{
			switch(json.kty.toUpperCase())
			{
				case "EC":
					this.parsedKey = new __WEBPACK_IMPORTED_MODULE_4__ECPrivateKey_js__["a" /* default */]({ json });

					this.privateKeyAlgorithm = new __WEBPACK_IMPORTED_MODULE_2__AlgorithmIdentifier_js__["a" /* default */]({
						algorithmId: "1.2.840.10045.2.1",
						algorithmParams: new __WEBPACK_IMPORTED_MODULE_0_asn1js__["ObjectIdentifier"]({ value: this.parsedKey.namedCurve })
					});
					break;
				case "RSA":
					this.parsedKey = new __WEBPACK_IMPORTED_MODULE_5__RSAPrivateKey_js__["a" /* default */]({ json });

					this.privateKeyAlgorithm = new __WEBPACK_IMPORTED_MODULE_2__AlgorithmIdentifier_js__["a" /* default */]({
						algorithmId: "1.2.840.113549.1.1.1",
						algorithmParams: new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Null"]()
					});
					break;
				default:
					throw new Error(`Invalid value for "kty" parameter: ${json.kty}`);
			}

			this.privateKey = new __WEBPACK_IMPORTED_MODULE_0_asn1js__["OctetString"]({ valueHex: this.parsedKey.toSchema().toBER(false) });
		}
	}
	//**********************************************************************************
}/* harmony export */ exports["a"] = PrivateKeyInfo;
//**************************************************************************************


/***/ },

/***/ "./node_modules/pkijs/src/PublicKeyInfo.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js__ = __webpack_require__("./node_modules/asn1js/build/asn1.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_asn1js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pvutils__ = __webpack_require__("./node_modules/pvutils/src/utils.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__common_js__ = __webpack_require__("./node_modules/pkijs/src/common.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__AlgorithmIdentifier_js__ = __webpack_require__("./node_modules/pkijs/src/AlgorithmIdentifier.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ECPublicKey_js__ = __webpack_require__("./node_modules/pkijs/src/ECPublicKey.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__RSAPublicKey_js__ = __webpack_require__("./node_modules/pkijs/src/RSAPublicKey.js");






//**************************************************************************************
/**
 * Class from RFC5280
 */
class PublicKeyInfo 
{
	//**********************************************************************************
	/**
	 * Constructor for PublicKeyInfo class
	 * @param {Object} [parameters={}]
	 * @param {Object} [parameters.schema] asn1js parsed value to initialize the class from
	 */
	constructor(parameters = {})
	{
		//region Internal properties of the object
		/**
		 * @type {AlgorithmIdentifier}
		 * @desc Algorithm identifier
		 */
		this.algorithm = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "algorithm", PublicKeyInfo.defaultValues("algorithm"));
		/**
		 * @type {BitString}
		 * @desc Subject public key value
		 */
		this.subjectPublicKey = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "subjectPublicKey", PublicKeyInfo.defaultValues("subjectPublicKey"));
		
		if("parsedKey" in parameters)
			/**
			 * @type {ECPublicKey|RSAPublicKey}
			 * @desc Parsed public key value
			 */
			this.parsedKey = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "parsedKey", PublicKeyInfo.defaultValues("parsedKey"));
		//endregion
		
		//region If input argument array contains "schema" for this object
		if("schema" in parameters)
			this.fromSchema(parameters.schema);
		//endregion
		//region If input argument array contains "json" for this object
		if("json" in parameters)
			this.fromJSON(parameters.json);
		//endregion
	}
	//**********************************************************************************
	/**
	 * Return default values for all class members
	 * @param {string} memberName String name for a class member
	 */
	static defaultValues(memberName)
	{
		switch(memberName)
		{
			case "algorithm":
				return new __WEBPACK_IMPORTED_MODULE_3__AlgorithmIdentifier_js__["a" /* default */]();
			case "subjectPublicKey":
				return new __WEBPACK_IMPORTED_MODULE_0_asn1js__["BitString"]();
			default:
				throw new Error(`Invalid member name for PublicKeyInfo class: ${memberName}`);
		}
	}
	//**********************************************************************************
	/**
	 * Return value of pre-defined ASN.1 schema for current class
	 *
	 * ASN.1 schema:
	 * ```asn1
	 * SubjectPublicKeyInfo  ::=  Sequence  {
	 *    algorithm            AlgorithmIdentifier,
	 *    subjectPublicKey     BIT STRING  }
	 * ```
	 *
	 * @param {Object} parameters Input parameters for the schema
	 * @returns {Object} asn1js schema object
	 */
	static schema(parameters = {})
	{
		/**
		 * @type {Object}
		 * @property {string} [blockName]
		 * @property {string} [algorithm]
		 * @property {string} [subjectPublicKey]
		 */
		const names = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "names", {});
		
		return (new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
			name: (names.blockName || ""),
			value: [
				__WEBPACK_IMPORTED_MODULE_3__AlgorithmIdentifier_js__["a" /* default */].schema(names.algorithm || {}),
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["BitString"]({ name: (names.subjectPublicKey || "") })
			]
		}));
	}
	//**********************************************************************************
	/**
	 * Convert parsed asn1js object into current class
	 * @param {!Object} schema
	 */
	fromSchema(schema)
	{
		//region Clear input data first
		__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["clearProps"])(schema, [
			"algorithm",
			"subjectPublicKey"
		]);
		//endregion
		
		//region Check the schema is valid
		const asn1 = __WEBPACK_IMPORTED_MODULE_0_asn1js__["compareSchema"](schema,
			schema,
			PublicKeyInfo.schema({
				names: {
					algorithm: {
						names: {
							blockName: "algorithm"
						}
					},
					subjectPublicKey: "subjectPublicKey"
				}
			})
		);
		
		if(asn1.verified === false)
			throw new Error("Object's schema was not verified against input data for PublicKeyInfo");
		//endregion
		
		//region Get internal properties from parsed schema
		this.algorithm = new __WEBPACK_IMPORTED_MODULE_3__AlgorithmIdentifier_js__["a" /* default */]({ schema: asn1.result.algorithm });
		this.subjectPublicKey = asn1.result.subjectPublicKey;
		
		switch(this.algorithm.algorithmId)
		{
			case "1.2.840.10045.2.1": // ECDSA
				if("algorithmParams" in this.algorithm)
				{
					if(this.algorithm.algorithmParams.constructor.blockName() === __WEBPACK_IMPORTED_MODULE_0_asn1js__["ObjectIdentifier"].blockName())
					{
						try
						{
							this.parsedKey = new __WEBPACK_IMPORTED_MODULE_4__ECPublicKey_js__["a" /* default */]({
								namedCurve: this.algorithm.algorithmParams.valueBlock.toString(),
								schema: this.subjectPublicKey.valueBlock.valueHex
							});
						}
						catch(ex){} // Could be a problems during recognision of internal public key data here. Let's ignore them.
					}
				}
				break;
			case "1.2.840.113549.1.1.1": // RSA
				{
					const publicKeyASN1 = __WEBPACK_IMPORTED_MODULE_0_asn1js__["fromBER"](this.subjectPublicKey.valueBlock.valueHex);
					if(publicKeyASN1.offset !== (-1))
					{
						try
						{
							this.parsedKey = new __WEBPACK_IMPORTED_MODULE_5__RSAPublicKey_js__["a" /* default */]({ schema: publicKeyASN1.result });
						}
						catch(ex){} // Could be a problems during recognision of internal public key data here. Let's ignore them.
					}
				}
				break;
			default:
		}
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convert current object to asn1js object and set correct values
	 * @returns {Object} asn1js object
	 */
	toSchema()
	{
		//region Construct and return new ASN.1 schema for this object
		return (new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
			value: [
				this.algorithm.toSchema(),
				this.subjectPublicKey
			]
		}));
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convertion for the class to JSON object
	 * @returns {Object}
	 */
	toJSON()
	{
		//region Return common value in case we do not have enough info fo making JWK
		if(("parsedKey" in this) === false)
		{
			return {
				algorithm: this.algorithm.toJSON(),
				subjectPublicKey: this.subjectPublicKey.toJSON()
			};
		}
		//endregion
		
		//region Making JWK
		const jwk = {};
		
		switch(this.algorithm.algorithmId)
		{
			case "1.2.840.10045.2.1": // ECDSA
				jwk.kty = "EC";
				break;
			case "1.2.840.113549.1.1.1": // RSA
				jwk.kty = "RSA";
				break;
			default:
		}
		
		const publicKeyJWK = this.parsedKey.toJSON();
		
		for(const key of Object.keys(publicKeyJWK))
			jwk[key] = publicKeyJWK[key];
		
		return jwk;
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convert JSON value into current object
	 * @param {Object} json
	 */
	fromJSON(json)
	{
		if("kty" in json)
		{
			switch(json.kty.toUpperCase())
			{
				case "EC":
					this.parsedKey = new __WEBPACK_IMPORTED_MODULE_4__ECPublicKey_js__["a" /* default */]({ json });
					
					this.algorithm = new __WEBPACK_IMPORTED_MODULE_3__AlgorithmIdentifier_js__["a" /* default */]({
						algorithmId: "1.2.840.10045.2.1",
						algorithmParams: new __WEBPACK_IMPORTED_MODULE_0_asn1js__["ObjectIdentifier"]({ value: this.parsedKey.namedCurve })
					});
					break;
				case "RSA":
					this.parsedKey = new __WEBPACK_IMPORTED_MODULE_5__RSAPublicKey_js__["a" /* default */]({ json });
					
					this.algorithm = new __WEBPACK_IMPORTED_MODULE_3__AlgorithmIdentifier_js__["a" /* default */]({
						algorithmId: "1.2.840.113549.1.1.1",
						algorithmParams: new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Null"]()
					});
					break;
				default:
					throw new Error(`Invalid value for "kty" parameter: ${json.kty}`);
			}
			
			this.subjectPublicKey = new __WEBPACK_IMPORTED_MODULE_0_asn1js__["BitString"]({ valueHex: this.parsedKey.toSchema().toBER(false) });
		}
	}
	//**********************************************************************************
	importKey(publicKey)
	{
		//region Initial variables
		let sequence = Promise.resolve();
		const _this = this;
		//endregion
		
		//region Initial check
		if(typeof publicKey === "undefined")
			return Promise.reject("Need to provide publicKey input parameter");
		//endregion
		
		//region Get a "crypto" extension
		const crypto = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__common_js__["a" /* getCrypto */])();
		if(typeof crypto === "undefined")
			return Promise.reject("Unable to create WebCrypto object");
		//endregion
		
		//region Export public key
		sequence = sequence.then(() =>
			crypto.exportKey("spki", publicKey));
		//endregion
		
		//region Initialize internal variables by parsing exported value
		sequence = sequence.then(
			/**
			 * @param {ArrayBuffer} exportedKey
			 */
			exportedKey =>
			{
				const asn1 = __WEBPACK_IMPORTED_MODULE_0_asn1js__["fromBER"](exportedKey);
				try
				{
					_this.fromSchema(asn1.result);
				}
				catch(exception)
				{
					return Promise.reject("Error during initializing object from schema");
				}
				
				return undefined;
			},
			error => Promise.reject(`Error during exporting public key: ${error}`)
		);
		//endregion
		
		return sequence;
	}
	//**********************************************************************************
}/* harmony export */ exports["a"] = PublicKeyInfo;
//**************************************************************************************


/***/ },

/***/ "./node_modules/pkijs/src/RSAPrivateKey.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js__ = __webpack_require__("./node_modules/asn1js/build/asn1.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_asn1js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pvutils__ = __webpack_require__("./node_modules/pvutils/src/utils.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__OtherPrimeInfo_js__ = __webpack_require__("./node_modules/pkijs/src/OtherPrimeInfo.js");



//**************************************************************************************
/**
 * Class from RFC3447
 */
class RSAPrivateKey
{
	//**********************************************************************************
	/**
	 * Constructor for RSAPrivateKey class
	 * @param {Object} [parameters={}]
	 * @param {Object} [parameters.schema] asn1js parsed value to initialize the class from
	 */
	constructor(parameters = {})
	{
		//region Internal properties of the object
		/**
		 * @type {number}
		 * @desc version
		 */
		this.version = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "version", RSAPrivateKey.defaultValues("version"));
		/**
		 * @type {Integer}
		 * @desc modulus
		 */
		this.modulus = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "modulus", RSAPrivateKey.defaultValues("modulus"));
		/**
		 * @type {Integer}
		 * @desc publicExponent
		 */
		this.publicExponent = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "publicExponent", RSAPrivateKey.defaultValues("publicExponent"));
		/**
		 * @type {Integer}
		 * @desc privateExponent
		 */
		this.privateExponent = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "privateExponent", RSAPrivateKey.defaultValues("privateExponent"));
		/**
		 * @type {Integer}
		 * @desc prime1
		 */
		this.prime1 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "prime1", RSAPrivateKey.defaultValues("prime1"));
		/**
		 * @type {Integer}
		 * @desc prime2
		 */
		this.prime2 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "prime2", RSAPrivateKey.defaultValues("prime2"));
		/**
		 * @type {Integer}
		 * @desc exponent1
		 */
		this.exponent1 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "exponent1", RSAPrivateKey.defaultValues("exponent1"));
		/**
		 * @type {Integer}
		 * @desc exponent2
		 */
		this.exponent2 = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "exponent2", RSAPrivateKey.defaultValues("exponent2"));
		/**
		 * @type {Integer}
		 * @desc coefficient
		 */
		this.coefficient = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "coefficient", RSAPrivateKey.defaultValues("coefficient"));

		if("otherPrimeInfos" in parameters)
			/**
			 * @type {Array.<OtherPrimeInfo>}
			 * @desc otherPrimeInfos
			 */
			this.otherPrimeInfos = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "otherPrimeInfos", RSAPrivateKey.defaultValues("otherPrimeInfos"));
		//endregion

		//region If input argument array contains "schema" for this object
		if("schema" in parameters)
			this.fromSchema(parameters.schema);
		//endregion
		//region If input argument array contains "json" for this object
		if("json" in parameters)
			this.fromJSON(parameters.json);
		//endregion
	}
	//**********************************************************************************
	/**
	 * Return default values for all class members
	 * @param {string} memberName String name for a class member
	 */
	static defaultValues(memberName)
	{
		switch(memberName)
		{
			case "version":
				return 0;
			case "modulus":
				return new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]();
			case "publicExponent":
				return new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]();
			case "privateExponent":
				return new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]();
			case "prime1":
				return new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]();
			case "prime2":
				return new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]();
			case "exponent1":
				return new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]();
			case "exponent2":
				return new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]();
			case "coefficient":
				return new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]();
			case "otherPrimeInfos":
				return [];
			default:
				throw new Error(`Invalid member name for RSAPrivateKey class: ${memberName}`);
		}
	}
	//**********************************************************************************
	/**
	 * Return value of pre-defined ASN.1 schema for current class
	 *
	 * ASN.1 schema:
	 * ```asn1
	 * RSAPrivateKey ::= Sequence {
	 *    version           Version,
	 *    modulus           Integer,  -- n
	 *    publicExponent    Integer,  -- e
	 *    privateExponent   Integer,  -- d
	 *    prime1            Integer,  -- p
	 *    prime2            Integer,  -- q
	 *    exponent1         Integer,  -- d mod (p-1)
	 *    exponent2         Integer,  -- d mod (q-1)
	 *    coefficient       Integer,  -- (inverse of q) mod p
	 *    otherPrimeInfos   OtherPrimeInfos OPTIONAL
	 * }
	 *
	 * OtherPrimeInfos ::= Sequence SIZE(1..MAX) OF OtherPrimeInfo
	 * ```
	 *
	 * @param {Object} parameters Input parameters for the schema
	 * @returns {Object} asn1js schema object
	 */
	static schema(parameters = {})
	{
		/**
		 * @type {Object}
		 * @property {string} [blockName]
		 * @property {string} [version]
		 * @property {string} [modulus]
		 * @property {string} [publicExponent]
		 * @property {string} [privateExponent]
		 * @property {string} [prime1]
		 * @property {string} [prime2]
		 * @property {string} [exponent1]
		 * @property {string} [exponent2]
		 * @property {string} [coefficient]
		 * @property {string} [otherPrimeInfosName]
		 * @property {Object} [otherPrimeInfo]
		 */
		const names = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "names", {});

		return (new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
			name: (names.blockName || ""),
			value: [
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ name: (names.version || "") }),
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ name: (names.modulus || "") }),
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ name: (names.publicExponent || "") }),
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ name: (names.privateExponent || "") }),
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ name: (names.prime1 || "") }),
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ name: (names.prime2 || "") }),
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ name: (names.exponent1 || "") }),
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ name: (names.exponent2 || "") }),
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ name: (names.coefficient || "") }),
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
					optional: true,
					value: [
						new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Repeated"]({
							name: (names.otherPrimeInfosName || ""),
							value: __WEBPACK_IMPORTED_MODULE_2__OtherPrimeInfo_js__["a" /* default */].schema(names.otherPrimeInfo || {})
						})
					]
				})
			]
		}));
	}
	//**********************************************************************************
	/**
	 * Convert parsed asn1js object into current class
	 * @param {!Object} schema
	 */
	fromSchema(schema)
	{
		//region Clear input data first
		__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["clearProps"])(schema, [
			"version",
			"modulus",
			"publicExponent",
			"privateExponent",
			"prime1",
			"prime2",
			"exponent1",
			"exponent2",
			"coefficient",
			"otherPrimeInfos"
		]);
		//endregion
		
		//region Check the schema is valid
		const asn1 = __WEBPACK_IMPORTED_MODULE_0_asn1js__["compareSchema"](schema,
			schema,
			RSAPrivateKey.schema({
				names: {
					version: "version",
					modulus: "modulus",
					publicExponent: "publicExponent",
					privateExponent: "privateExponent",
					prime1: "prime1",
					prime2: "prime2",
					exponent1: "exponent1",
					exponent2: "exponent2",
					coefficient: "coefficient",
					otherPrimeInfo: {
						names: {
							blockName: "otherPrimeInfos"
						}
					}
				}
			})
		);

		if(asn1.verified === false)
			throw new Error("Object's schema was not verified against input data for RSAPrivateKey");
		//endregion

		//region Get internal properties from parsed schema
		this.version = asn1.result.version.valueBlock.valueDec;
		this.modulus = asn1.result.modulus.convertFromDER(256);
		this.publicExponent = asn1.result.publicExponent;
		this.privateExponent = asn1.result.privateExponent.convertFromDER(256);
		this.prime1 = asn1.result.prime1.convertFromDER(128);
		this.prime2 = asn1.result.prime2.convertFromDER(128);
		this.exponent1 = asn1.result.exponent1.convertFromDER(128);
		this.exponent2 = asn1.result.exponent2.convertFromDER(128);
		this.coefficient = asn1.result.coefficient.convertFromDER(128);

		if("otherPrimeInfos" in asn1.result)
			this.otherPrimeInfos = Array.from(asn1.result.otherPrimeInfos, element => new __WEBPACK_IMPORTED_MODULE_2__OtherPrimeInfo_js__["a" /* default */]({ schema: element }));
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convert current object to asn1js object and set correct values
	 * @returns {Object} asn1js object
	 */
	toSchema()
	{
		//region Create array for output sequence
		const outputArray = [];
		
		outputArray.push(new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ value: this.version }));
		outputArray.push(this.modulus.convertToDER());
		outputArray.push(this.publicExponent);
		outputArray.push(this.privateExponent.convertToDER());
		outputArray.push(this.prime1.convertToDER());
		outputArray.push(this.prime2.convertToDER());
		outputArray.push(this.exponent1.convertToDER());
		outputArray.push(this.exponent2.convertToDER());
		outputArray.push(this.coefficient.convertToDER());
		
		if("otherPrimeInfos" in this)
		{
			outputArray.push(new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
				value: Array.from(this.otherPrimeInfos, element => element.toSchema())
			}));
		}
		//endregion
		
		//region Construct and return new ASN.1 schema for this object
		return (new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
			value: outputArray
		}));
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convertion for the class to JSON object
	 * @returns {Object}
	 */
	toJSON()
	{
		const jwk = {
			n: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["toBase64"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["arrayBufferToString"])(this.modulus.valueBlock.valueHex), true, true, true),
			e: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["toBase64"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["arrayBufferToString"])(this.publicExponent.valueBlock.valueHex), true, true, true),
			d: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["toBase64"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["arrayBufferToString"])(this.privateExponent.valueBlock.valueHex), true, true, true),
			p: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["toBase64"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["arrayBufferToString"])(this.prime1.valueBlock.valueHex), true, true, true),
			q: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["toBase64"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["arrayBufferToString"])(this.prime2.valueBlock.valueHex), true, true, true),
			dp: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["toBase64"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["arrayBufferToString"])(this.exponent1.valueBlock.valueHex), true, true, true),
			dq: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["toBase64"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["arrayBufferToString"])(this.exponent2.valueBlock.valueHex), true, true, true),
			qi: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["toBase64"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["arrayBufferToString"])(this.coefficient.valueBlock.valueHex), true, true, true)
		};

		if("otherPrimeInfos" in this)
			jwk.oth = Array.from(this.otherPrimeInfos, element => element.toJSON());

		return jwk;
	}
	//**********************************************************************************
	/**
	 * Convert JSON value into current object
	 * @param {Object} json
	 */
	fromJSON(json)
	{
		if("n" in json)
			this.modulus = new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ valueHex: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["stringToArrayBuffer"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["fromBase64"])(json.n, true, true)) });
		else
			throw new Error("Absent mandatory parameter \"n\"");

		if("e" in json)
			this.publicExponent = new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ valueHex: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["stringToArrayBuffer"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["fromBase64"])(json.e, true, true)) });
		else
			throw new Error("Absent mandatory parameter \"e\"");

		if("d" in json)
			this.privateExponent = new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ valueHex: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["stringToArrayBuffer"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["fromBase64"])(json.d, true, true)) });
		else
			throw new Error("Absent mandatory parameter \"d\"");

		if("p" in json)
			this.prime1 = new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ valueHex: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["stringToArrayBuffer"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["fromBase64"])(json.p, true, true)) });
		else
			throw new Error("Absent mandatory parameter \"p\"");

		if("q" in json)
			this.prime2 = new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ valueHex: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["stringToArrayBuffer"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["fromBase64"])(json.q, true, true)) });
		else
			throw new Error("Absent mandatory parameter \"q\"");

		if("dp" in json)
			this.exponent1 = new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ valueHex: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["stringToArrayBuffer"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["fromBase64"])(json.dp, true, true)) });
		else
			throw new Error("Absent mandatory parameter \"dp\"");

		if("dq" in json)
			this.exponent2 = new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ valueHex: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["stringToArrayBuffer"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["fromBase64"])(json.dq, true, true)) });
		else
			throw new Error("Absent mandatory parameter \"dq\"");

		if("qi" in json)
			this.coefficient = new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ valueHex: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["stringToArrayBuffer"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["fromBase64"])(json.qi, true, true)) });
		else
			throw new Error("Absent mandatory parameter \"qi\"");

		if("oth" in json)
			this.otherPrimeInfos = Array.from(json.oth, element => new __WEBPACK_IMPORTED_MODULE_2__OtherPrimeInfo_js__["a" /* default */]({ json: element }));
	}
	//**********************************************************************************
}/* harmony export */ exports["a"] = RSAPrivateKey;
//**************************************************************************************


/***/ },

/***/ "./node_modules/pkijs/src/RSAPublicKey.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js__ = __webpack_require__("./node_modules/asn1js/build/asn1.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_asn1js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pvutils__ = __webpack_require__("./node_modules/pvutils/src/utils.js");


//**************************************************************************************
/**
 * Class from RFC3447
 */
class RSAPublicKey
{
	//**********************************************************************************
	/**
	 * Constructor for RSAPublicKey class
	 * @param {Object} [parameters={}]
	 * @param {Object} [parameters.schema] asn1js parsed value to initialize the class from
	 * @property {Integer} [modulus]
	 * @property {Integer} [publicExponent]
	 */
	constructor(parameters = {})
	{
		//region Internal properties of the object
		/**
		 * @type {Integer}
		 * @desc Modulus part of RSA public key
		 */
		this.modulus = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "modulus", RSAPublicKey.defaultValues("modulus"));
		/**
		 * @type {Integer}
		 * @desc Public exponent of RSA public key
		 */
		this.publicExponent = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "publicExponent", RSAPublicKey.defaultValues("publicExponent"));
		//endregion

		//region If input argument array contains "schema" for this object
		if("schema" in parameters)
			this.fromSchema(parameters.schema);
		//endregion
		//region If input argument array contains "json" for this object
		if("json" in parameters)
			this.fromJSON(parameters.json);
		//endregion
	}
	//**********************************************************************************
	/**
	 * Return default values for all class members
	 * @param {string} memberName String name for a class member
	 */
	static defaultValues(memberName)
	{
		switch(memberName)
		{
			case "modulus":
				return new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]();
			case "publicExponent":
				return new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]();
			default:
				throw new Error(`Invalid member name for RSAPublicKey class: ${memberName}`);
		}
	}
	//**********************************************************************************
	/**
	 * Return value of pre-defined ASN.1 schema for current class
	 *
	 * ASN.1 schema:
	 * ```asn1
	 * RSAPublicKey ::= Sequence {
	 *    modulus           Integer,  -- n
	 *    publicExponent    Integer   -- e
	 * }
	 * ```
	 *
	 * @param {Object} parameters Input parameters for the schema
	 * @returns {Object} asn1js schema object
	 */
	static schema(parameters = {})
	{
		/**
		 * @type {Object}
		 * @property {string} utcTimeName Name for "utcTimeName" choice
		 * @property {string} generalTimeName Name for "generalTimeName" choice
		 */
		const names = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "names", {});

		return (new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
			name: (names.blockName || ""),
			value: [
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ name: (names.modulus || "") }),
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ name: (names.publicExponent || "") })
			]
		}));
	}
	//**********************************************************************************
	/**
	 * Convert parsed asn1js object into current class
	 * @param {!Object} schema
	 */
	fromSchema(schema)
	{
		//region Clear input data first
		__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["clearProps"])(schema, [
			"modulus",
			"publicExponent"
		]);
		//endregion
		
		//region Check the schema is valid
		const asn1 = __WEBPACK_IMPORTED_MODULE_0_asn1js__["compareSchema"](schema,
			schema,
			RSAPublicKey.schema({
				names: {
					modulus: "modulus",
					publicExponent: "publicExponent"
				}
			})
		);

		if(asn1.verified === false)
			throw new Error("Object's schema was not verified against input data for RSAPublicKey");
		//endregion

		//region Get internal properties from parsed schema
		this.modulus = asn1.result.modulus.convertFromDER(256);
		this.publicExponent = asn1.result.publicExponent;
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convert current object to asn1js object and set correct values
	 * @returns {Object} asn1js object
	 */
	toSchema()
	{
		//region Construct and return new ASN.1 schema for this object
		return (new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
			value: [
				this.modulus.convertToDER(),
				this.publicExponent
			]
		}));
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convertion for the class to JSON object
	 * @returns {Object}
	 */
	toJSON()
	{
		return {
			n: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["toBase64"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["arrayBufferToString"])(this.modulus.valueBlock.valueHex), true, true, true),
			e: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["toBase64"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["arrayBufferToString"])(this.publicExponent.valueBlock.valueHex), true, true, true)
		};
	}
	//**********************************************************************************
	/**
	 * Convert JSON value into current object
	 * @param {Object} json
	 */
	fromJSON(json)
	{
		if("n" in json)
		{
			const array = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["stringToArrayBuffer"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["fromBase64"])(json.n, true));
			this.modulus = new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ valueHex: array.slice(0, Math.pow(2, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["nearestPowerOf2"])(array.byteLength))) });
		}
		else
			throw new Error("Absent mandatory parameter \"n\"");

		if("e" in json)
			this.publicExponent = new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ valueHex: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["stringToArrayBuffer"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["fromBase64"])(json.e, true)).slice(0, 3) });
		else
			throw new Error("Absent mandatory parameter \"e\"");
	}
	//**********************************************************************************
}/* harmony export */ exports["a"] = RSAPublicKey;
//**************************************************************************************


/***/ },

/***/ "./node_modules/pkijs/src/RSASSAPSSParams.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js__ = __webpack_require__("./node_modules/asn1js/build/asn1.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_asn1js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pvutils__ = __webpack_require__("./node_modules/pvutils/src/utils.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__AlgorithmIdentifier_js__ = __webpack_require__("./node_modules/pkijs/src/AlgorithmIdentifier.js");



//**************************************************************************************
/**
 * Class from RFC4055
 */
class RSASSAPSSParams
{
	//**********************************************************************************
	/**
	 * Constructor for RSASSAPSSParams class
	 * @param {Object} [parameters={}]
	 * @param {Object} [parameters.schema] asn1js parsed value to initialize the class from
	 */
	constructor(parameters = {})
	{
		//region Internal properties of the object
		/**
		 * @type {AlgorithmIdentifier}
		 * @desc Algorithms of hashing (DEFAULT sha1)
		 */
		this.hashAlgorithm = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "hashAlgorithm", RSASSAPSSParams.defaultValues("hashAlgorithm"));
		/**
		 * @type {AlgorithmIdentifier}
		 * @desc Algorithm of "mask generaion function (MGF)" (DEFAULT mgf1SHA1)
		 */
		this.maskGenAlgorithm = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "maskGenAlgorithm", RSASSAPSSParams.defaultValues("maskGenAlgorithm"));
		/**
		 * @type {number}
		 * @desc Salt length (DEFAULT 20)
		 */
		this.saltLength = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "saltLength", RSASSAPSSParams.defaultValues("saltLength"));
		/**
		 * @type {number}
		 * @desc (DEFAULT 1)
		 */
		this.trailerField = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "trailerField", RSASSAPSSParams.defaultValues("trailerField"));
		//endregion

		//region If input argument array contains "schema" for this object
		if("schema" in parameters)
			this.fromSchema(parameters.schema);
		//endregion
	}
	//**********************************************************************************
	/**
	 * Return default values for all class members
	 * @param {string} memberName String name for a class member
	 */
	static defaultValues(memberName)
	{
		switch(memberName)
		{
			case "hashAlgorithm":
				return new __WEBPACK_IMPORTED_MODULE_2__AlgorithmIdentifier_js__["a" /* default */]({
					algorithmId: "1.3.14.3.2.26", // SHA-1
					algorithmParams: new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Null"]()
				});
			case "maskGenAlgorithm":
				return new __WEBPACK_IMPORTED_MODULE_2__AlgorithmIdentifier_js__["a" /* default */]({
					algorithmId: "1.2.840.113549.1.1.8", // MGF1
					algorithmParams: (new __WEBPACK_IMPORTED_MODULE_2__AlgorithmIdentifier_js__["a" /* default */]({
						algorithmId: "1.3.14.3.2.26", // SHA-1
						algorithmParams: new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Null"]()
					})).toSchema()
				});
			case "saltLength":
				return 20;
			case "trailerField":
				return 1;
			default:
				throw new Error(`Invalid member name for RSASSAPSSParams class: ${memberName}`);
		}
	}
	//**********************************************************************************
	/**
	 * Return value of pre-defined ASN.1 schema for current class
	 *
	 * ASN.1 schema:
	 * ```asn1
	 * RSASSA-PSS-params  ::=  Sequence  {
	 *    hashAlgorithm      [0] HashAlgorithm DEFAULT sha1Identifier,
	 *    maskGenAlgorithm   [1] MaskGenAlgorithm DEFAULT mgf1SHA1Identifier,
	 *    saltLength         [2] Integer DEFAULT 20,
	 *    trailerField       [3] Integer DEFAULT 1  }
	 * ```
	 *
	 * @param {Object} parameters Input parameters for the schema
	 * @returns {Object} asn1js schema object
	 */
	static schema(parameters = {})
	{
		/**
		 * @type {Object}
		 * @property {string} [blockName]
		 * @property {string} [hashAlgorithm]
		 * @property {string} [maskGenAlgorithm]
		 * @property {string} [saltLength]
		 * @property {string} [trailerField]
		 */
		const names = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "names", {});

		return (new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
			name: (names.blockName || ""),
			value: [
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Constructed"]({
					idBlock: {
						tagClass: 3, // CONTEXT-SPECIFIC
						tagNumber: 0 // [0]
					},
					optional: true,
					value: [__WEBPACK_IMPORTED_MODULE_2__AlgorithmIdentifier_js__["a" /* default */].schema(names.hashAlgorithm || {})]
				}),
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Constructed"]({
					idBlock: {
						tagClass: 3, // CONTEXT-SPECIFIC
						tagNumber: 1 // [1]
					},
					optional: true,
					value: [__WEBPACK_IMPORTED_MODULE_2__AlgorithmIdentifier_js__["a" /* default */].schema(names.maskGenAlgorithm || {})]
				}),
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Constructed"]({
					idBlock: {
						tagClass: 3, // CONTEXT-SPECIFIC
						tagNumber: 2 // [2]
					},
					optional: true,
					value: [new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ name: (names.saltLength || "") })]
				}),
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Constructed"]({
					idBlock: {
						tagClass: 3, // CONTEXT-SPECIFIC
						tagNumber: 3 // [3]
					},
					optional: true,
					value: [new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ name: (names.trailerField || "") })]
				})
			]
		}));
	}
	//**********************************************************************************
	/**
	 * Convert parsed asn1js object into current class
	 * @param {!Object} schema
	 */
	fromSchema(schema)
	{
		//region Clear input data first
		__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["clearProps"])(schema, [
			"hashAlgorithm",
			"maskGenAlgorithm",
			"saltLength",
			"trailerField"
		]);
		//endregion
		
		//region Check the schema is valid
		const asn1 = __WEBPACK_IMPORTED_MODULE_0_asn1js__["compareSchema"](schema,
			schema,
			RSASSAPSSParams.schema({
				names: {
					hashAlgorithm: {
						names: {
							blockName: "hashAlgorithm"
						}
					},
					maskGenAlgorithm: {
						names: {
							blockName: "maskGenAlgorithm"
						}
					},
					saltLength: "saltLength",
					trailerField: "trailerField"
				}
			})
		);

		if(asn1.verified === false)
			throw new Error("Object's schema was not verified against input data for RSASSAPSSParams");
		//endregion

		//region Get internal properties from parsed schema
		if("hashAlgorithm" in asn1.result)
			this.hashAlgorithm = new __WEBPACK_IMPORTED_MODULE_2__AlgorithmIdentifier_js__["a" /* default */]({ schema: asn1.result.hashAlgorithm });

		if("maskGenAlgorithm" in asn1.result)
			this.maskGenAlgorithm = new __WEBPACK_IMPORTED_MODULE_2__AlgorithmIdentifier_js__["a" /* default */]({ schema: asn1.result.maskGenAlgorithm });

		if("saltLength" in asn1.result)
			this.saltLength = asn1.result.saltLength.valueBlock.valueDec;

		if("trailerField" in asn1.result)
			this.trailerField = asn1.result.trailerField.valueBlock.valueDec;
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convert current object to asn1js object and set correct values
	 * @returns {Object} asn1js object
	 */
	toSchema()
	{
		//region Create array for output sequence
		const outputArray = [];
		
		if(!this.hashAlgorithm.isEqual(RSASSAPSSParams.defaultValues("hashAlgorithm")))
		{
			outputArray.push(new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Constructed"]({
				idBlock: {
					tagClass: 3, // CONTEXT-SPECIFIC
					tagNumber: 0 // [0]
				},
				value: [this.hashAlgorithm.toSchema()]
			}));
		}
		
		if(!this.maskGenAlgorithm.isEqual(RSASSAPSSParams.defaultValues("maskGenAlgorithm")))
		{
			outputArray.push(new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Constructed"]({
				idBlock: {
					tagClass: 3, // CONTEXT-SPECIFIC
					tagNumber: 1 // [1]
				},
				value: [this.maskGenAlgorithm.toSchema()]
			}));
		}
		
		if(this.saltLength !== RSASSAPSSParams.defaultValues("saltLength"))
		{
			outputArray.push(new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Constructed"]({
				idBlock: {
					tagClass: 3, // CONTEXT-SPECIFIC
					tagNumber: 2 // [2]
				},
				value: [new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ value: this.saltLength })]
			}));
		}
		
		if(this.trailerField !== RSASSAPSSParams.defaultValues("trailerField"))
		{
			outputArray.push(new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Constructed"]({
				idBlock: {
					tagClass: 3, // CONTEXT-SPECIFIC
					tagNumber: 3 // [3]
				},
				value: [new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ value: this.trailerField })]
			}));
		}
		//endregion
		
		//region Construct and return new ASN.1 schema for this object
		return (new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
			value: outputArray
		}));
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convertion for the class to JSON object
	 * @returns {Object}
	 */
	toJSON()
	{
		const object = {};

		if(!this.hashAlgorithm.isEqual(RSASSAPSSParams.defaultValues("hashAlgorithm")))
			object.hashAlgorithm = this.hashAlgorithm.toJSON();

		if(!this.maskGenAlgorithm.isEqual(RSASSAPSSParams.defaultValues("maskGenAlgorithm")))
			object.maskGenAlgorithm = this.maskGenAlgorithm.toJSON();

		if(this.saltLength !== RSASSAPSSParams.defaultValues("saltLength"))
			object.saltLength = this.saltLength;

		if(this.trailerField !== RSASSAPSSParams.defaultValues("trailerField"))
			object.trailerField = this.trailerField;

		return object;
	}
	//**********************************************************************************
}/* harmony export */ exports["a"] = RSASSAPSSParams;
//**************************************************************************************


/***/ },

/***/ "./node_modules/pkijs/src/RelativeDistinguishedNames.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js__ = __webpack_require__("./node_modules/asn1js/build/asn1.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_asn1js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pvutils__ = __webpack_require__("./node_modules/pvutils/src/utils.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__AttributeTypeAndValue_js__ = __webpack_require__("./node_modules/pkijs/src/AttributeTypeAndValue.js");



//**************************************************************************************
/**
 * Class from RFC5280
 */
class RelativeDistinguishedNames
{
	//**********************************************************************************
	/**
	 * Constructor for RelativeDistinguishedNames class
	 * @param {Object} [parameters={}]
	 * @param {Object} [parameters.schema] asn1js parsed value to initialize the class from
	 * @property {Array.<AttributeTypeAndValue>} [typesAndValues] Array of "type and value" objects
	 * @property {ArrayBuffer} [valueBeforeDecode] Value of the RDN before decoding from schema
	 */
	constructor(parameters = {})
	{
		//region Internal properties of the object
		/**
		 * @type {Array.<AttributeTypeAndValue>}
		 * @desc Array of "type and value" objects
		 */
		this.typesAndValues = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "typesAndValues", RelativeDistinguishedNames.defaultValues("typesAndValues"));
		/**
		 * @type {ArrayBuffer}
		 * @desc Value of the RDN before decoding from schema
		 */
		this.valueBeforeDecode = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "valueBeforeDecode", RelativeDistinguishedNames.defaultValues("valueBeforeDecode"));
		//endregion

		//region If input argument array contains "schema" for this object
		if("schema" in parameters)
			this.fromSchema(parameters.schema);
		//endregion
	}
	//**********************************************************************************
	/**
	 * Return default values for all class members
	 * @param {string} memberName String name for a class member
	 */
	static defaultValues(memberName)
	{
		switch(memberName)
		{
			case "typesAndValues":
				return [];
			case "valueBeforeDecode":
				return new ArrayBuffer(0);
			default:
				throw new Error(`Invalid member name for RelativeDistinguishedNames class: ${memberName}`);
		}
	}
	//**********************************************************************************
	/**
	 * Compare values with default values for all class members
	 * @param {string} memberName String name for a class member
	 * @param {*} memberValue Value to compare with default value
	 */
	static compareWithDefault(memberName, memberValue)
	{
		switch(memberName)
		{
			case "typesAndValues":
				return (memberValue.length === 0);
			case "valueBeforeDecode":
				return (memberValue.byteLength === 0);
			default:
				throw new Error(`Invalid member name for RelativeDistinguishedNames class: ${memberName}`);
		}
	}
	//**********************************************************************************
	/**
	 * Return value of pre-defined ASN.1 schema for current class
	 *
	 * ASN.1 schema:
	 * ```asn1
	 * RDNSequence ::= Sequence OF RelativeDistinguishedName
	 *
	 * RelativeDistinguishedName ::=
	 * SET SIZE (1..MAX) OF AttributeTypeAndValue
	 * ```
	 *
	 * @param {Object} parameters Input parameters for the schema
	 * @returns {Object} asn1js schema object
	 */
	static schema(parameters = {})
	{
		/**
		 * @type {Object}
		 * @property {string} [blockName] Name for entire block
		 * @property {string} [repeatedSequence] Name for "repeatedSequence" block
		 * @property {string} [repeatedSet] Name for "repeatedSet" block
		 * @property {string} [typeAndValue] Name for "typeAndValue" block
		 */
		const names = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["getParametersValue"])(parameters, "names", {});

		return (new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
			name: (names.blockName || ""),
			value: [
				new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Repeated"]({
					name: (names.repeatedSequence || ""),
					value: new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Set"]({
						value: [
							new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Repeated"]({
								name: (names.repeatedSet || ""),
								value: __WEBPACK_IMPORTED_MODULE_2__AttributeTypeAndValue_js__["default"].schema(names.typeAndValue || {})
							})
						]
					})
				})
			]
		}));
	}
	//**********************************************************************************
	/**
	 * Convert parsed asn1js object into current class
	 * @param {!Object} schema
	 */
	fromSchema(schema)
	{
		//region Clear input data first
		__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["clearProps"])(schema, [
			"RDN",
			"typesAndValues"
		]);
		//endregion
		
		//region Check the schema is valid
		const asn1 = __WEBPACK_IMPORTED_MODULE_0_asn1js__["compareSchema"](schema,
			schema,
			RelativeDistinguishedNames.schema({
				names: {
					blockName: "RDN",
					repeatedSet: "typesAndValues"
				}
			})
		);

		if(asn1.verified === false)
			throw new Error("Object's schema was not verified against input data for RelativeDistinguishedNames");
		//endregion

		//region Get internal properties from parsed schema
		if("typesAndValues" in asn1.result) // Could be a case when there is no "types and values"
			this.typesAndValues = Array.from(asn1.result.typesAndValues, element => new __WEBPACK_IMPORTED_MODULE_2__AttributeTypeAndValue_js__["default"]({ schema: element }));

		// noinspection JSUnresolvedVariable
		this.valueBeforeDecode = asn1.result.RDN.valueBeforeDecode;
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convert current object to asn1js object and set correct values
	 * @returns {Object} asn1js object
	 */
	toSchema()
	{
		//region Decode stored TBS value
		if(this.valueBeforeDecode.byteLength === 0) // No stored encoded array, create "from scratch"
		{
			return (new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
				value: [new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Set"]({
					value: Array.from(this.typesAndValues, element => element.toSchema())
				})]
			}));
		}

		const asn1 = __WEBPACK_IMPORTED_MODULE_0_asn1js__["fromBER"](this.valueBeforeDecode);
		//endregion

		//region Construct and return new ASN.1 schema for this object
		return asn1.result;
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convertion for the class to JSON object
	 * @returns {Object}
	 */
	toJSON()
	{
		return {
			typesAndValues: Array.from(this.typesAndValues, element => element.toJSON())
		};
	}
	//**********************************************************************************
	/**
	 * Compare two RDN values, or RDN with ArrayBuffer value
	 * @param {(RelativeDistinguishedNames|ArrayBuffer)} compareTo The value compare to current
	 * @returns {boolean}
	 */
	isEqual(compareTo)
	{
		if(compareTo instanceof RelativeDistinguishedNames)
		{
			if(this.typesAndValues.length !== compareTo.typesAndValues.length)
				return false;

			for(const [index, typeAndValue] of this.typesAndValues.entries())
			{
				if(typeAndValue.isEqual(compareTo.typesAndValues[index]) === false)
					return false;
			}

			return true;
		}

		if(compareTo instanceof ArrayBuffer)
			return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["isEqualBuffer"])(this.valueBeforeDecode, compareTo);

		return false;
	}
	//**********************************************************************************
}/* harmony export */ exports["a"] = RelativeDistinguishedNames;
//**************************************************************************************


/***/ },

/***/ "./node_modules/pkijs/src/common.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, global) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js__ = __webpack_require__("./node_modules/asn1js/build/asn1.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_asn1js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_asn1js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_pvutils__ = __webpack_require__("./node_modules/pvutils/src/utils.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__CryptoEngine_js__ = __webpack_require__("./node_modules/pkijs/src/CryptoEngine.js");
/* unused harmony export setEngine *//* harmony export */ exports["e"] = getEngine;/* harmony export */ exports["a"] = getCrypto;/* unused harmony export getRandomValues *//* unused harmony export getOIDByAlgorithm *//* unused harmony export getAlgorithmParameters *//* harmony export */ exports["b"] = createCMSECDSASignature;/* harmony export */ exports["d"] = stringPrep;/* harmony export */ exports["c"] = createECDSASignatureFromCMS;/* unused harmony export getAlgorithmByOID *//* unused harmony export getHashAlgorithm *//* unused harmony export kdfWithCounter *//* unused harmony export kdf */


//**************************************************************************************
//region Crypto engine related function
//**************************************************************************************
let engine = {
	name: "none",
	crypto: null,
	subtle: null
};
//**************************************************************************************
function setEngine(name, crypto, subtle)
{
	//region We are in Node
	// noinspection JSUnresolvedVariable
	if((typeof process !== "undefined") && ("pid" in process) && (typeof global !== "undefined") && (typeof window === "undefined"))
	{
		// noinspection ES6ModulesDependencies, JSUnresolvedVariable
		if(typeof global[process.pid] === "undefined")
		{
			// noinspection JSUnresolvedVariable
			global[process.pid] = {};
		}
		else
		{
			// noinspection JSUnresolvedVariable
			if(typeof global[process.pid] !== "object")
			{
				// noinspection JSUnresolvedVariable
				throw new Error(`Name global.${process.pid} already exists and it is not an object`);
			}
		}
		
		// noinspection JSUnresolvedVariable
		if(typeof global[process.pid].pkijs === "undefined")
		{
			// noinspection JSUnresolvedVariable
			global[process.pid].pkijs = {};
		}
		else
		{
			// noinspection JSUnresolvedVariable
			if(typeof global[process.pid].pkijs !== "object")
			{
				// noinspection JSUnresolvedVariable
				throw new Error(`Name global.${process.pid}.pkijs already exists and it is not an object`);
			}
		}
		
		// noinspection JSUnresolvedVariable
		global[process.pid].pkijs.engine = {
			name: name,
			crypto: crypto,
			subtle: subtle
		};
	}
	//endregion
	//region We are in browser
	else
	{
		if(engine.name !== name)
		{
			engine = {
				name: name,
				crypto: crypto,
				subtle: subtle
			};
		}
	}
	//endregion
}
//**************************************************************************************
function getEngine()
{
	//region We are in Node
	// noinspection JSUnresolvedVariable
	if((typeof process !== "undefined") && ("pid" in process) && (typeof global !== "undefined") && (typeof window === "undefined"))
	{
		let _engine;
		
		try
		{
			// noinspection JSUnresolvedVariable
			_engine = global[process.pid].pkijs.engine;
		}
		catch(ex)
		{
			throw new Error("Please call \"setEngine\" before call to \"getEngine\"");
		}
		
		return _engine;
	}
	//endregion
	
	return engine;
}
//**************************************************************************************
(function initCryptoEngine()
{
	if(typeof self !== "undefined")
	{
		if("crypto" in self)
		{
			let engineName = "webcrypto";
			
			/**
			 * Standard crypto object
			 * @type {Object}
			 * @property {Object} [webkitSubtle] Subtle object from Apple
			 */
			const cryptoObject = self.crypto;
			let subtleObject;
			
			// Apple Safari support
			if("webkitSubtle" in self.crypto)
			{
				try
				{
					subtleObject = self.crypto.webkitSubtle;
				}
				catch(ex)
				{
					subtleObject = self.crypto.subtle;
				}
				
				engineName = "safari";
			}
			
			if("subtle" in self.crypto)
				subtleObject = self.crypto.subtle;


			if(typeof subtleObject === "undefined")
			{
				engine = {
					name: engineName,
					crypto: cryptoObject,
					subtle: null
				};
			}
			else
			{
				engine = {
					name: engineName,
					crypto: cryptoObject,
					subtle: new __WEBPACK_IMPORTED_MODULE_2__CryptoEngine_js__["a" /* default */]({name: engineName, crypto: self.crypto, subtle: subtleObject})
				};
			}
		}
	}
	
	setEngine(engine.name, engine.crypto, engine.subtle);
})();
//**************************************************************************************
//endregion
//**************************************************************************************
//region Declaration of common functions
//**************************************************************************************
/**
 * Get crypto subtle from current "crypto engine" or "undefined"
 * @returns {({decrypt, deriveKey, digest, encrypt, exportKey, generateKey, importKey, sign, unwrapKey, verify, wrapKey}|null)}
 */
function getCrypto()
{
	const _engine = getEngine();
	
	if(_engine.subtle !== null)
		return _engine.subtle;
	
	return undefined;
}
//**************************************************************************************
/**
 * Initialize input Uint8Array by random values (with help from current "crypto engine")
 * @param {!Uint8Array} view
 * @returns {*}
 */
function getRandomValues(view)
{
	return getEngine().subtle.getRandomValues(view);
}
//**************************************************************************************
/**
 * Get OID for each specific algorithm
 * @param {Object} algorithm
 * @returns {string}
 */
function getOIDByAlgorithm(algorithm)
{
	return getEngine().subtle.getOIDByAlgorithm(algorithm);
}
//**************************************************************************************
/**
 * Get default algorithm parameters for each kind of operation
 * @param {string} algorithmName Algorithm name to get common parameters for
 * @param {string} operation Kind of operation: "sign", "encrypt", "generatekey", "importkey", "exportkey", "verify"
 * @returns {*}
 */
function getAlgorithmParameters(algorithmName, operation)
{
	return getEngine().subtle.getAlgorithmParameters(algorithmName, operation);
}
//**************************************************************************************
/**
 * Create CMS ECDSA signature from WebCrypto ECDSA signature
 * @param {ArrayBuffer} signatureBuffer WebCrypto result of "sign" function
 * @returns {ArrayBuffer}
 */
function createCMSECDSASignature(signatureBuffer)
{
	//region Initial check for correct length
	if((signatureBuffer.byteLength % 2) !== 0)
		return new ArrayBuffer(0);
	//endregion
	
	//region Initial variables
	const length = signatureBuffer.byteLength / 2; // There are two equal parts inside incoming ArrayBuffer
	
	const rBuffer = new ArrayBuffer(length);
	const rView = new Uint8Array(rBuffer);
	rView.set(new Uint8Array(signatureBuffer, 0, length));
	
	const rInteger = new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ valueHex: rBuffer });
	
	const sBuffer = new ArrayBuffer(length);
	const sView = new Uint8Array(sBuffer);
	sView.set(new Uint8Array(signatureBuffer, length, length));
	
	const sInteger = new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]({ valueHex: sBuffer });
	//endregion
	
	return (new __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]({
		value: [
			rInteger.convertToDER(),
			sInteger.convertToDER()
		]
	})).toBER(false);
}
//**************************************************************************************
/**
 * String preparation function. In a future here will be realization of algorithm from RFC4518
 * @param {string} inputString JavaScript string. As soon as for each ASN.1 string type we have a specific transformation function here we will work with pure JavaScript string
 * @returns {string} Formated string
 */
function stringPrep(inputString)
{
	//region Initial variables
	let isSpace = false;
	let cuttedResult = "";
	//endregion
	
	const result = inputString.trim(); // Trim input string
	
	//region Change all sequence of SPACE down to SPACE char
	for(let i = 0; i < result.length; i++)
	{
		if(result.charCodeAt(i) === 32)
		{
			if(isSpace === false)
				isSpace = true;
		}
		else
		{
			if(isSpace)
			{
				cuttedResult += " ";
				isSpace = false;
			}
			
			cuttedResult += result[i];
		}
	}
	//endregion
	
	return cuttedResult.toLowerCase();
}
//**************************************************************************************
/**
 * Create a single ArrayBuffer from CMS ECDSA signature
 * @param {Sequence} cmsSignature ASN.1 SEQUENCE contains CMS ECDSA signature
 * @returns {ArrayBuffer}
 */
function createECDSASignatureFromCMS(cmsSignature)
{
	//region Check input variables
	if((cmsSignature instanceof __WEBPACK_IMPORTED_MODULE_0_asn1js__["Sequence"]) === false)
		return new ArrayBuffer(0);
	
	if(cmsSignature.valueBlock.value.length !== 2)
		return new ArrayBuffer(0);
	
	if((cmsSignature.valueBlock.value[0] instanceof __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]) === false)
		return new ArrayBuffer(0);
	
	if((cmsSignature.valueBlock.value[1] instanceof __WEBPACK_IMPORTED_MODULE_0_asn1js__["Integer"]) === false)
		return new ArrayBuffer(0);
	//endregion
	
	const rValue = cmsSignature.valueBlock.value[0].convertFromDER();
	const sValue = cmsSignature.valueBlock.value[1].convertFromDER();
	
	//region Check the lengths of two parts are equal
	switch(true)
	{
		case (rValue.valueBlock.valueHex.byteLength < sValue.valueBlock.valueHex.byteLength):
			{
				if((sValue.valueBlock.valueHex.byteLength - rValue.valueBlock.valueHex.byteLength) !== 1)
					throw new Error("Incorrect DER integer decoding");
				
				const correctedLength = sValue.valueBlock.valueHex.byteLength;
				
				const rValueView = new Uint8Array(rValue.valueBlock.valueHex);
				
				const rValueBufferCorrected = new ArrayBuffer(correctedLength);
				const rValueViewCorrected = new Uint8Array(rValueBufferCorrected);
				
				rValueViewCorrected.set(rValueView, 1);
				rValueViewCorrected[0] = 0x00; // In order to be sure we do not have any garbage here
				
				return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["utilConcatBuf"])(rValueBufferCorrected, sValue.valueBlock.valueHex);
			}
		case (rValue.valueBlock.valueHex.byteLength > sValue.valueBlock.valueHex.byteLength):
			{
				if((rValue.valueBlock.valueHex.byteLength - sValue.valueBlock.valueHex.byteLength) !== 1)
					throw new Error("Incorrect DER integer decoding");
				
				const correctedLength = rValue.valueBlock.valueHex.byteLength;
				
				const sValueView = new Uint8Array(sValue.valueBlock.valueHex);
				
				const sValueBufferCorrected = new ArrayBuffer(correctedLength);
				const sValueViewCorrected = new Uint8Array(sValueBufferCorrected);
				
				sValueViewCorrected.set(sValueView, 1);
				sValueViewCorrected[0] = 0x00; // In order to be sure we do not have any garbage here
				
				return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["utilConcatBuf"])(rValue.valueBlock.valueHex, sValueBufferCorrected);
			}
		default:
			{
				//region In case we have equal length and the length is not even with 2
				if(rValue.valueBlock.valueHex.byteLength % 2)
				{
					const correctedLength = (rValue.valueBlock.valueHex.byteLength + 1);
					
					const rValueView = new Uint8Array(rValue.valueBlock.valueHex);
					
					const rValueBufferCorrected = new ArrayBuffer(correctedLength);
					const rValueViewCorrected = new Uint8Array(rValueBufferCorrected);
					
					rValueViewCorrected.set(rValueView, 1);
					rValueViewCorrected[0] = 0x00; // In order to be sure we do not have any garbage here
					
					const sValueView = new Uint8Array(sValue.valueBlock.valueHex);
					
					const sValueBufferCorrected = new ArrayBuffer(correctedLength);
					const sValueViewCorrected = new Uint8Array(sValueBufferCorrected);
					
					sValueViewCorrected.set(sValueView, 1);
					sValueViewCorrected[0] = 0x00; // In order to be sure we do not have any garbage here
					
					return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["utilConcatBuf"])(rValueBufferCorrected, sValueBufferCorrected);
				}
				//endregion
			}
	}
	//endregion
	
	return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["utilConcatBuf"])(rValue.valueBlock.valueHex, sValue.valueBlock.valueHex);
}
//**************************************************************************************
/**
 * Get WebCrypto algorithm by wel-known OID
 * @param {string} oid well-known OID to search for
 * @returns {Object}
 */
function getAlgorithmByOID(oid)
{
	return getEngine().subtle.getAlgorithmByOID(oid);
}
//**************************************************************************************
/**
 * Getting hash algorithm by signature algorithm
 * @param {AlgorithmIdentifier} signatureAlgorithm Signature algorithm
 * @returns {string}
 */
function getHashAlgorithm(signatureAlgorithm)
{
	return getEngine().subtle.getHashAlgorithm(signatureAlgorithm);
}
//**************************************************************************************
/**
 * ANS X9.63 Key Derivation Function having a "Counter" as a parameter
 * @param {string} hashFunction Used hash function
 * @param {ArrayBuffer} Zbuffer ArrayBuffer containing ECDH shared secret to derive from
 * @param {number} Counter
 * @param {ArrayBuffer} SharedInfo Usually DER encoded "ECC_CMS_SharedInfo" structure
 */
function kdfWithCounter(hashFunction, Zbuffer, Counter, SharedInfo)
{
	//region Check of input parameters
	switch(hashFunction.toUpperCase())
	{
		case "SHA-1":
		case "SHA-256":
		case "SHA-384":
		case "SHA-512":
			break;
		default:
			return Promise.reject(`Unknown hash function: ${hashFunction}`);
	}
	
	if((Zbuffer instanceof ArrayBuffer) === false)
		return Promise.reject("Please set \"Zbuffer\" as \"ArrayBuffer\"");
	
	if(Zbuffer.byteLength === 0)
		return Promise.reject("\"Zbuffer\" has zero length, error");
	
	if((SharedInfo instanceof ArrayBuffer) === false)
		return Promise.reject("Please set \"SharedInfo\" as \"ArrayBuffer\"");
	
	if(Counter > 255)
		return Promise.reject("Please set \"Counter\" variable to value less or equal to 255");
	//endregion
	
	//region Initial variables
	const counterBuffer = new ArrayBuffer(4);
	const counterView = new Uint8Array(counterBuffer);
	counterView[0] = 0x00;
	counterView[1] = 0x00;
	counterView[2] = 0x00;
	counterView[3] = Counter;
	
	let combinedBuffer = new ArrayBuffer(0);
	//endregion
	
	//region Get a "crypto" extension
	const crypto = getCrypto();
	if(typeof crypto === "undefined")
		return Promise.reject("Unable to create WebCrypto object");
	//endregion
	
	//region Create a combined ArrayBuffer for digesting
	combinedBuffer = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["utilConcatBuf"])(combinedBuffer, Zbuffer);
	combinedBuffer = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["utilConcatBuf"])(combinedBuffer, counterBuffer);
	combinedBuffer = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["utilConcatBuf"])(combinedBuffer, SharedInfo);
	//endregion
	
	//region Return digest of combined ArrayBuffer and information about current counter
	return crypto.digest({
		name: hashFunction
	},
	combinedBuffer)
		.then(result =>
			({
				counter: Counter,
				result
			}));
	//endregion
}
//**************************************************************************************
/**
 * ANS X9.63 Key Derivation Function
 * @param {string} hashFunction Used hash function
 * @param {ArrayBuffer} Zbuffer ArrayBuffer containing ECDH shared secret to derive from
 * @param {number} keydatalen Length (!!! in BITS !!!) of used kew derivation function
 * @param {ArrayBuffer} SharedInfo Usually DER encoded "ECC_CMS_SharedInfo" structure
 */
function kdf(hashFunction, Zbuffer, keydatalen, SharedInfo)
{
	//region Initial variables
	let hashLength = 0;
	let maxCounter = 1;
	
	const kdfArray = [];
	//endregion
	
	//region Check of input parameters
	switch(hashFunction.toUpperCase())
	{
		case "SHA-1":
			hashLength = 160; // In bits
			break;
		case "SHA-256":
			hashLength = 256; // In bits
			break;
		case "SHA-384":
			hashLength = 384; // In bits
			break;
		case "SHA-512":
			hashLength = 512; // In bits
			break;
		default:
			return Promise.reject(`Unknown hash function: ${hashFunction}`);
	}
	
	if((Zbuffer instanceof ArrayBuffer) === false)
		return Promise.reject("Please set \"Zbuffer\" as \"ArrayBuffer\"");
	
	if(Zbuffer.byteLength === 0)
		return Promise.reject("\"Zbuffer\" has zero length, error");
	
	if((SharedInfo instanceof ArrayBuffer) === false)
		return Promise.reject("Please set \"SharedInfo\" as \"ArrayBuffer\"");
	//endregion
	
	//region Calculated maximum value of "Counter" variable
	const quotient = keydatalen / hashLength;
	
	if(Math.floor(quotient) > 0)
	{
		maxCounter = Math.floor(quotient);
		
		if((quotient - maxCounter) > 0)
			maxCounter++;
	}
	//endregion
	
	//region Create an array of "kdfWithCounter"
	for(let i = 1; i <= maxCounter; i++)
		kdfArray.push(kdfWithCounter(hashFunction, Zbuffer, i, SharedInfo));
	//endregion
	
	//region Return combined digest with specified length
	return Promise.all(kdfArray).then(incomingResult =>
	{
		//region Initial variables
		let combinedBuffer = new ArrayBuffer(0);
		let currentCounter = 1;
		let found = true;
		//endregion
		
		//region Combine all buffer together
		while(found)
		{
			found = false;
			
			for(const result of incomingResult)
			{
				if(result.counter === currentCounter)
				{
					combinedBuffer = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_pvutils__["utilConcatBuf"])(combinedBuffer, result.result);
					found = true;
					break;
				}
			}
			
			currentCounter++;
		}
		//endregion
		
		//region Create output buffer with specified length
		keydatalen >>= 3; // Divide by 8 since "keydatalen" is in bits
		
		if(combinedBuffer.byteLength > keydatalen)
		{
			const newBuffer = new ArrayBuffer(keydatalen);
			const newView = new Uint8Array(newBuffer);
			const combinedView = new Uint8Array(combinedBuffer);
			
			for(let i = 0; i < keydatalen; i++)
				newView[i] = combinedView[i];
			
			return newBuffer;
		}
		
		return combinedBuffer; // Since the situation when "combinedBuffer.byteLength < keydatalen" here we have only "combinedBuffer.byteLength === keydatalen"
		//endregion
	});
	//endregion
}
//**************************************************************************************
//endregion
//**************************************************************************************

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/process/browser.js"), __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ },

/***/ "./node_modules/pvtsutils/build/index.js":
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {/**
 * Copyright (c) 2020, Peculiar Ventures, All rights reserved.
 */

(function (global, factory) {
   true ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.pvtsutils = {}));
}(this, (function (exports) { 'use strict';

  class BufferSourceConverter {
      static isArrayBuffer(data) {
          return Object.prototype.toString.call(data) === '[object ArrayBuffer]';
      }
      static toArrayBuffer(data) {
          const buf = this.toUint8Array(data);
          if (buf.byteOffset || buf.length) {
              return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
          }
          return buf.buffer;
      }
      static toUint8Array(data) {
          if (typeof Buffer !== "undefined" && Buffer.isBuffer(data)) {
              return new Uint8Array(data);
          }
          if (ArrayBuffer.isView(data)) {
              return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
          }
          if (this.isArrayBuffer(data)) {
              return new Uint8Array(data);
          }
          throw new TypeError("The provided value is not of type '(ArrayBuffer or ArrayBufferView)'");
      }
      static isBufferSource(data) {
          return this.isArrayBufferView(data)
              || this.isArrayBuffer(data);
      }
      static isArrayBufferView(data) {
          return ArrayBuffer.isView(data)
              || (data && this.isArrayBuffer(data.buffer));
      }
  }

  function PrepareBuffer(buffer) {
      if (typeof Buffer !== "undefined" && Buffer.isBuffer(buffer)) {
          return new Uint8Array(buffer);
      }
      else if (BufferSourceConverter.isArrayBufferView(buffer)) {
          return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
      }
      else {
          return new Uint8Array(buffer);
      }
  }
  class Convert {
      static isHex(data) {
          return typeof data === "string"
              && /^[a-z0-9]+$/i.test(data);
      }
      static isBase64(data) {
          return typeof data === "string"
              && /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(data);
      }
      static isBase64Url(data) {
          return typeof data === "string"
              && /^[a-zA-Z0-9-_]+$/i.test(data);
      }
      static ToString(buffer, enc = "utf8") {
          const buf = PrepareBuffer(buffer);
          switch (enc.toLowerCase()) {
              case "utf8":
                  return this.ToUtf8String(buf);
              case "binary":
                  return this.ToBinary(buf);
              case "hex":
                  return this.ToHex(buf);
              case "base64":
                  return this.ToBase64(buf);
              case "base64url":
                  return this.ToBase64Url(buf);
              default:
                  throw new Error(`Unknown type of encoding '${enc}'`);
          }
      }
      static FromString(str, enc = "utf8") {
          if (!str) {
              return new ArrayBuffer(0);
          }
          switch (enc.toLowerCase()) {
              case "utf8":
                  return this.FromUtf8String(str);
              case "binary":
                  return this.FromBinary(str);
              case "hex":
                  return this.FromHex(str);
              case "base64":
                  return this.FromBase64(str);
              case "base64url":
                  return this.FromBase64Url(str);
              default:
                  throw new Error(`Unknown type of encoding '${enc}'`);
          }
      }
      static ToBase64(buffer) {
          const buf = PrepareBuffer(buffer);
          if (typeof btoa !== "undefined") {
              const binary = this.ToString(buf, "binary");
              return btoa(binary);
          }
          else {
              return Buffer.from(buf).toString("base64");
          }
      }
      static FromBase64(base64) {
          const formatted = this.formatString(base64);
          if (!formatted) {
              return new ArrayBuffer(0);
          }
          if (!Convert.isBase64(formatted)) {
              throw new TypeError("Argument 'base64Text' is not Base64 encoded");
          }
          if (typeof atob !== "undefined") {
              return this.FromBinary(atob(formatted));
          }
          else {
              return new Uint8Array(Buffer.from(formatted, "base64")).buffer;
          }
      }
      static FromBase64Url(base64url) {
          const formatted = this.formatString(base64url);
          if (!formatted) {
              return new ArrayBuffer(0);
          }
          if (!Convert.isBase64Url(formatted)) {
              throw new TypeError("Argument 'base64url' is not Base64Url encoded");
          }
          return this.FromBase64(this.Base64Padding(formatted.replace(/\-/g, "+").replace(/\_/g, "/")));
      }
      static ToBase64Url(data) {
          return this.ToBase64(data).replace(/\+/g, "-").replace(/\//g, "_").replace(/\=/g, "");
      }
      static FromUtf8String(text) {
          const s = unescape(encodeURIComponent(text));
          const uintArray = new Uint8Array(s.length);
          for (let i = 0; i < s.length; i++) {
              uintArray[i] = s.charCodeAt(i);
          }
          return uintArray.buffer;
      }
      static ToUtf8String(buffer) {
          const buf = PrepareBuffer(buffer);
          const encodedString = String.fromCharCode.apply(null, buf);
          const decodedString = decodeURIComponent(escape(encodedString));
          return decodedString;
      }
      static FromBinary(text) {
          const stringLength = text.length;
          const resultView = new Uint8Array(stringLength);
          for (let i = 0; i < stringLength; i++) {
              resultView[i] = text.charCodeAt(i);
          }
          return resultView.buffer;
      }
      static ToBinary(buffer) {
          const buf = PrepareBuffer(buffer);
          let resultString = "";
          const len = buf.length;
          for (let i = 0; i < len; i++) {
              resultString = resultString + String.fromCharCode(buf[i]);
          }
          return resultString;
      }
      static ToHex(buffer) {
          const buf = PrepareBuffer(buffer);
          const splitter = "";
          const res = [];
          const len = buf.length;
          for (let i = 0; i < len; i++) {
              const char = buf[i].toString(16);
              res.push(char.length === 1 ? "0" + char : char);
          }
          return res.join(splitter);
      }
      static FromHex(hexString) {
          let formatted = this.formatString(hexString);
          if (!formatted) {
              return new ArrayBuffer(0);
          }
          if (!Convert.isHex(formatted)) {
              throw new TypeError("Argument 'hexString' is not HEX encoded");
          }
          if (formatted.length % 2) {
              formatted = `0${formatted}`;
          }
          const res = new Uint8Array(formatted.length / 2);
          for (let i = 0; i < formatted.length; i = i + 2) {
              const c = formatted.slice(i, i + 2);
              res[i / 2] = parseInt(c, 16);
          }
          return res.buffer;
      }
      static Base64Padding(base64) {
          const padCount = 4 - (base64.length % 4);
          if (padCount < 4) {
              for (let i = 0; i < padCount; i++) {
                  base64 += "=";
              }
          }
          return base64;
      }
      static formatString(data) {
          return (data === null || data === void 0 ? void 0 : data.replace(/[\n\r\t ]/g, "")) || "";
      }
  }

  function assign(target, ...sources) {
      const res = arguments[0];
      for (let i = 1; i < arguments.length; i++) {
          const obj = arguments[i];
          for (const prop in obj) {
              res[prop] = obj[prop];
          }
      }
      return res;
  }
  function combine(...buf) {
      const totalByteLength = buf.map((item) => item.byteLength).reduce((prev, cur) => prev + cur);
      const res = new Uint8Array(totalByteLength);
      let currentPos = 0;
      buf.map((item) => new Uint8Array(item)).forEach((arr) => {
          for (const item2 of arr) {
              res[currentPos++] = item2;
          }
      });
      return res.buffer;
  }
  function isEqual(bytes1, bytes2) {
      if (!(bytes1 && bytes2)) {
          return false;
      }
      if (bytes1.byteLength !== bytes2.byteLength) {
          return false;
      }
      const b1 = new Uint8Array(bytes1);
      const b2 = new Uint8Array(bytes2);
      for (let i = 0; i < bytes1.byteLength; i++) {
          if (b1[i] !== b2[i]) {
              return false;
          }
      }
      return true;
  }

  exports.BufferSourceConverter = BufferSourceConverter;
  exports.Convert = Convert;
  exports.assign = assign;
  exports.combine = combine;
  exports.isEqual = isEqual;

  Object.defineProperty(exports, '__esModule', { value: true });

})));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__("./node_modules/buffer/index.js").Buffer))

/***/ },

/***/ "./node_modules/pvutils/src/utils.js":
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export */ exports["getUTCDate"] = getUTCDate;/* harmony export */ exports["getParametersValue"] = getParametersValue;/* harmony export */ exports["bufferToHexCodes"] = bufferToHexCodes;/* harmony export */ exports["checkBufferParams"] = checkBufferParams;/* harmony export */ exports["utilFromBase"] = utilFromBase;/* harmony export */ exports["utilToBase"] = utilToBase;/* harmony export */ exports["utilConcatBuf"] = utilConcatBuf;/* harmony export */ exports["utilConcatView"] = utilConcatView;/* harmony export */ exports["utilDecodeTC"] = utilDecodeTC;/* harmony export */ exports["utilEncodeTC"] = utilEncodeTC;/* harmony export */ exports["isEqualBuffer"] = isEqualBuffer;/* harmony export */ exports["padNumber"] = padNumber;/* harmony export */ exports["toBase64"] = toBase64;/* harmony export */ exports["fromBase64"] = fromBase64;/* harmony export */ exports["arrayBufferToString"] = arrayBufferToString;/* harmony export */ exports["stringToArrayBuffer"] = stringToArrayBuffer;/* harmony export */ exports["nearestPowerOf2"] = nearestPowerOf2;/* harmony export */ exports["clearProps"] = clearProps;//**************************************************************************************
/**
 * Making UTC date from local date
 * @param {Date} date Date to convert from
 * @returns {Date}
 */
function getUTCDate(date)
{
	// noinspection NestedFunctionCallJS, MagicNumberJS
	return new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
}
//**************************************************************************************
// noinspection FunctionWithMultipleReturnPointsJS
/**
 * Get value for input parameters, or set a default value
 * @param {Object} parameters
 * @param {string} name
 * @param defaultValue
 */
function getParametersValue(parameters, name, defaultValue)
{
	// noinspection ConstantOnRightSideOfComparisonJS, NonBlockStatementBodyJS
	if((parameters instanceof Object) === false)
		return defaultValue;
	
	// noinspection NonBlockStatementBodyJS
	if(name in parameters)
		return parameters[name];
	
	return defaultValue;
}
//**************************************************************************************
/**
 * Converts "ArrayBuffer" into a hexdecimal string
 * @param {ArrayBuffer} inputBuffer
 * @param {number} [inputOffset=0]
 * @param {number} [inputLength=inputBuffer.byteLength]
 * @param {boolean} [insertSpace=false]
 * @returns {string}
 */
function bufferToHexCodes(inputBuffer, inputOffset = 0, inputLength = (inputBuffer.byteLength - inputOffset), insertSpace = false)
{
	let result = "";
	
	for(const item of (new Uint8Array(inputBuffer, inputOffset, inputLength)))
	{
		// noinspection ChainedFunctionCallJS
		const str = item.toString(16).toUpperCase();
		
		// noinspection ConstantOnRightSideOfComparisonJS, NonBlockStatementBodyJS
		if(str.length === 1)
			result += "0";
		
		result += str;
		
		// noinspection NonBlockStatementBodyJS
		if(insertSpace)
			result += " ";
	}
	
	return result.trim();
}
//**************************************************************************************
// noinspection JSValidateJSDoc, FunctionWithMultipleReturnPointsJS
/**
 * Check input "ArrayBuffer" for common functions
 * @param {LocalBaseBlock} baseBlock
 * @param {ArrayBuffer} inputBuffer
 * @param {number} inputOffset
 * @param {number} inputLength
 * @returns {boolean}
 */
function checkBufferParams(baseBlock, inputBuffer, inputOffset, inputLength)
{
	// noinspection ConstantOnRightSideOfComparisonJS
	if((inputBuffer instanceof ArrayBuffer) === false)
	{
		// noinspection JSUndefinedPropertyAssignment
		baseBlock.error = "Wrong parameter: inputBuffer must be \"ArrayBuffer\"";
		return false;
	}
	
	// noinspection ConstantOnRightSideOfComparisonJS
	if(inputBuffer.byteLength === 0)
	{
		// noinspection JSUndefinedPropertyAssignment
		baseBlock.error = "Wrong parameter: inputBuffer has zero length";
		return false;
	}
	
	// noinspection ConstantOnRightSideOfComparisonJS
	if(inputOffset < 0)
	{
		// noinspection JSUndefinedPropertyAssignment
		baseBlock.error = "Wrong parameter: inputOffset less than zero";
		return false;
	}
	
	// noinspection ConstantOnRightSideOfComparisonJS
	if(inputLength < 0)
	{
		// noinspection JSUndefinedPropertyAssignment
		baseBlock.error = "Wrong parameter: inputLength less than zero";
		return false;
	}
	
	// noinspection ConstantOnRightSideOfComparisonJS
	if((inputBuffer.byteLength - inputOffset - inputLength) < 0)
	{
		// noinspection JSUndefinedPropertyAssignment
		baseBlock.error = "End of input reached before message was fully decoded (inconsistent offset and length values)";
		return false;
	}
	
	return true;
}
//**************************************************************************************
// noinspection FunctionWithMultipleReturnPointsJS
/**
 * Convert number from 2^base to 2^10
 * @param {Uint8Array} inputBuffer
 * @param {number} inputBase
 * @returns {number}
 */
function utilFromBase(inputBuffer, inputBase)
{
	let result = 0;
	
	// noinspection ConstantOnRightSideOfComparisonJS, NonBlockStatementBodyJS
	if(inputBuffer.length === 1)
		return inputBuffer[0];
	
	// noinspection ConstantOnRightSideOfComparisonJS, NonBlockStatementBodyJS
	for(let i = (inputBuffer.length - 1); i >= 0; i--)
		result += inputBuffer[(inputBuffer.length - 1) - i] * Math.pow(2, inputBase * i);
	
	return result;
}
//**************************************************************************************
// noinspection FunctionWithMultipleLoopsJS, FunctionWithMultipleReturnPointsJS
/**
 * Convert number from 2^10 to 2^base
 * @param {!number} value The number to convert
 * @param {!number} base The base for 2^base
 * @param {number} [reserved=0] Pre-defined number of bytes in output array (-1 = limited by function itself)
 * @returns {ArrayBuffer}
 */
function utilToBase(value, base, reserved = (-1))
{
	const internalReserved = reserved;
	let internalValue = value;
	
	let result = 0;
	let biggest = Math.pow(2, base);
	
	// noinspection ConstantOnRightSideOfComparisonJS
	for(let i = 1; i < 8; i++)
	{
		if(value < biggest)
		{
			let retBuf;
			
			// noinspection ConstantOnRightSideOfComparisonJS
			if(internalReserved < 0)
			{
				retBuf = new ArrayBuffer(i);
				result = i;
			}
			else
			{
				// noinspection NonBlockStatementBodyJS
				if(internalReserved < i)
					return (new ArrayBuffer(0));
				
				retBuf = new ArrayBuffer(internalReserved);
				
				result = internalReserved;
			}
			
			const retView = new Uint8Array(retBuf);
			
			// noinspection ConstantOnRightSideOfComparisonJS
			for(let j = (i - 1); j >= 0; j--)
			{
				const basis = Math.pow(2, j * base);
				
				retView[result - j - 1] = Math.floor(internalValue / basis);
				internalValue -= (retView[result - j - 1]) * basis;
			}
			
			return retBuf;
		}
		
		biggest *= Math.pow(2, base);
	}
	
	return new ArrayBuffer(0);
}
//**************************************************************************************
// noinspection FunctionWithMultipleLoopsJS
/**
 * Concatenate two ArrayBuffers
 * @param {...ArrayBuffer} buffers Set of ArrayBuffer
 */
function utilConcatBuf(...buffers)
{
	//region Initial variables
	let outputLength = 0;
	let prevLength = 0;
	//endregion
	
	//region Calculate output length
	
	// noinspection NonBlockStatementBodyJS
	for(const buffer of buffers)
		outputLength += buffer.byteLength;
	//endregion
	
	const retBuf = new ArrayBuffer(outputLength);
	const retView = new Uint8Array(retBuf);
	
	for(const buffer of buffers)
	{
		// noinspection NestedFunctionCallJS
		retView.set(new Uint8Array(buffer), prevLength);
		prevLength += buffer.byteLength;
	}
	
	return retBuf;
}
//**************************************************************************************
// noinspection FunctionWithMultipleLoopsJS
/**
 * Concatenate two Uint8Array
 * @param {...Uint8Array} views Set of Uint8Array
 */
function utilConcatView(...views)
{
	//region Initial variables
	let outputLength = 0;
	let prevLength = 0;
	//endregion
	
	//region Calculate output length
	// noinspection NonBlockStatementBodyJS
	for(const view of views)
		outputLength += view.length;
	//endregion
	
	const retBuf = new ArrayBuffer(outputLength);
	const retView = new Uint8Array(retBuf);
	
	for(const view of views)
	{
		retView.set(view, prevLength);
		prevLength += view.length;
	}
	
	return retView;
}
//**************************************************************************************
// noinspection FunctionWithMultipleLoopsJS
/**
 * Decoding of "two complement" values
 * The function must be called in scope of instance of "hexBlock" class ("valueHex" and "warnings" properties must be present)
 * @returns {number}
 */
function utilDecodeTC()
{
	const buf = new Uint8Array(this.valueHex);
	
	// noinspection ConstantOnRightSideOfComparisonJS
	if(this.valueHex.byteLength >= 2)
	{
		//noinspection JSBitwiseOperatorUsage, ConstantOnRightSideOfComparisonJS, LocalVariableNamingConventionJS, MagicNumberJS, NonShortCircuitBooleanExpressionJS
		const condition1 = (buf[0] === 0xFF) && (buf[1] & 0x80);
		// noinspection ConstantOnRightSideOfComparisonJS, LocalVariableNamingConventionJS, MagicNumberJS, NonShortCircuitBooleanExpressionJS
		const condition2 = (buf[0] === 0x00) && ((buf[1] & 0x80) === 0x00);
		
		// noinspection NonBlockStatementBodyJS
		if(condition1 || condition2)
			this.warnings.push("Needlessly long format");
	}
	
	//region Create big part of the integer
	const bigIntBuffer = new ArrayBuffer(this.valueHex.byteLength);
	const bigIntView = new Uint8Array(bigIntBuffer);
	// noinspection NonBlockStatementBodyJS
	for(let i = 0; i < this.valueHex.byteLength; i++)
		bigIntView[i] = 0;
	
	// noinspection MagicNumberJS, NonShortCircuitBooleanExpressionJS
	bigIntView[0] = (buf[0] & 0x80); // mask only the biggest bit
	
	const bigInt = utilFromBase(bigIntView, 8);
	//endregion
	
	//region Create small part of the integer
	const smallIntBuffer = new ArrayBuffer(this.valueHex.byteLength);
	const smallIntView = new Uint8Array(smallIntBuffer);
	// noinspection NonBlockStatementBodyJS
	for(let j = 0; j < this.valueHex.byteLength; j++)
		smallIntView[j] = buf[j];
	
	// noinspection MagicNumberJS
	smallIntView[0] &= 0x7F; // mask biggest bit
	
	const smallInt = utilFromBase(smallIntView, 8);
	//endregion
	
	return (smallInt - bigInt);
}
//**************************************************************************************
// noinspection FunctionWithMultipleLoopsJS, FunctionWithMultipleReturnPointsJS
/**
 * Encode integer value to "two complement" format
 * @param {number} value Value to encode
 * @returns {ArrayBuffer}
 */
function utilEncodeTC(value)
{
	// noinspection ConstantOnRightSideOfComparisonJS, ConditionalExpressionJS
	const modValue = (value < 0) ? (value * (-1)) : value;
	let bigInt = 128;
	
	// noinspection ConstantOnRightSideOfComparisonJS
	for(let i = 1; i < 8; i++)
	{
		if(modValue <= bigInt)
		{
			// noinspection ConstantOnRightSideOfComparisonJS
			if(value < 0)
			{
				const smallInt = bigInt - modValue;
				
				const retBuf = utilToBase(smallInt, 8, i);
				const retView = new Uint8Array(retBuf);
				
				// noinspection MagicNumberJS
				retView[0] |= 0x80;
				
				return retBuf;
			}
			
			let retBuf = utilToBase(modValue, 8, i);
			let retView = new Uint8Array(retBuf);
			
			//noinspection JSBitwiseOperatorUsage, MagicNumberJS, NonShortCircuitBooleanExpressionJS
			if(retView[0] & 0x80)
			{
				//noinspection JSCheckFunctionSignatures
				const tempBuf = retBuf.slice(0);
				const tempView = new Uint8Array(tempBuf);
				
				retBuf = new ArrayBuffer(retBuf.byteLength + 1);
				// noinspection ReuseOfLocalVariableJS
				retView = new Uint8Array(retBuf);
				
				// noinspection NonBlockStatementBodyJS
				for(let k = 0; k < tempBuf.byteLength; k++)
					retView[k + 1] = tempView[k];
				
				// noinspection MagicNumberJS
				retView[0] = 0x00;
			}
			
			return retBuf;
		}
		
		bigInt *= Math.pow(2, 8);
	}
	
	return (new ArrayBuffer(0));
}
//**************************************************************************************
// noinspection FunctionWithMultipleReturnPointsJS, ParameterNamingConventionJS
/**
 * Compare two array buffers
 * @param {!ArrayBuffer} inputBuffer1
 * @param {!ArrayBuffer} inputBuffer2
 * @returns {boolean}
 */
function isEqualBuffer(inputBuffer1, inputBuffer2)
{
	// noinspection NonBlockStatementBodyJS
	if(inputBuffer1.byteLength !== inputBuffer2.byteLength)
		return false;
	
	// noinspection LocalVariableNamingConventionJS
	const view1 = new Uint8Array(inputBuffer1);
	// noinspection LocalVariableNamingConventionJS
	const view2 = new Uint8Array(inputBuffer2);
	
	for(let i = 0; i < view1.length; i++)
	{
		// noinspection NonBlockStatementBodyJS
		if(view1[i] !== view2[i])
			return false;
	}
	
	return true;
}
//**************************************************************************************
// noinspection FunctionWithMultipleReturnPointsJS
/**
 * Pad input number with leade "0" if needed
 * @returns {string}
 * @param {number} inputNumber
 * @param {number} fullLength
 */
function padNumber(inputNumber, fullLength)
{
	const str = inputNumber.toString(10);
	
	// noinspection NonBlockStatementBodyJS
	if(fullLength < str.length)
		return "";
	
	const dif = fullLength - str.length;
	
	const padding = new Array(dif);
	// noinspection NonBlockStatementBodyJS
	for(let i = 0; i < dif; i++)
		padding[i] = "0";
	
	const paddingString = padding.join("");
	
	return paddingString.concat(str);
}
//**************************************************************************************
const base64Template = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const base64UrlTemplate = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=";
//**************************************************************************************
// noinspection FunctionWithMultipleLoopsJS, OverlyComplexFunctionJS, FunctionTooLongJS, FunctionNamingConventionJS
/**
 * Encode string into BASE64 (or "base64url")
 * @param {string} input
 * @param {boolean} useUrlTemplate If "true" then output would be encoded using "base64url"
 * @param {boolean} skipPadding Skip BASE-64 padding or not
 * @param {boolean} skipLeadingZeros Skip leading zeros in input data or not
 * @returns {string}
 */
function toBase64(input, useUrlTemplate = false, skipPadding = false, skipLeadingZeros = false)
{
	let i = 0;
	
	// noinspection LocalVariableNamingConventionJS
	let flag1 = 0;
	// noinspection LocalVariableNamingConventionJS
	let flag2 = 0;
	
	let output = "";
	
	// noinspection ConditionalExpressionJS
	const template = (useUrlTemplate) ? base64UrlTemplate : base64Template;
	
	if(skipLeadingZeros)
	{
		let nonZeroPosition = 0;
		
		for(let i = 0; i < input.length; i++)
		{
			// noinspection ConstantOnRightSideOfComparisonJS
			if(input.charCodeAt(i) !== 0)
			{
				nonZeroPosition = i;
				// noinspection BreakStatementJS
				break;
			}
		}
		
		// noinspection AssignmentToFunctionParameterJS
		input = input.slice(nonZeroPosition);
	}
	
	while(i < input.length)
	{
		// noinspection LocalVariableNamingConventionJS, IncrementDecrementResultUsedJS
		const chr1 = input.charCodeAt(i++);
		// noinspection NonBlockStatementBodyJS
		if(i >= input.length)
			flag1 = 1;
		// noinspection LocalVariableNamingConventionJS, IncrementDecrementResultUsedJS
		const chr2 = input.charCodeAt(i++);
		// noinspection NonBlockStatementBodyJS
		if(i >= input.length)
			flag2 = 1;
		// noinspection LocalVariableNamingConventionJS, IncrementDecrementResultUsedJS
		const chr3 = input.charCodeAt(i++);
		
		// noinspection LocalVariableNamingConventionJS
		const enc1 = chr1 >> 2;
		// noinspection LocalVariableNamingConventionJS, MagicNumberJS, NonShortCircuitBooleanExpressionJS
		const enc2 = ((chr1 & 0x03) << 4) | (chr2 >> 4);
		// noinspection LocalVariableNamingConventionJS, MagicNumberJS, NonShortCircuitBooleanExpressionJS
		let enc3 = ((chr2 & 0x0F) << 2) | (chr3 >> 6);
		// noinspection LocalVariableNamingConventionJS, MagicNumberJS, NonShortCircuitBooleanExpressionJS
		let enc4 = chr3 & 0x3F;
		
		// noinspection ConstantOnRightSideOfComparisonJS
		if(flag1 === 1)
		{
			// noinspection NestedAssignmentJS, AssignmentResultUsedJS, MagicNumberJS
			enc3 = enc4 = 64;
		}
		else
		{
			// noinspection ConstantOnRightSideOfComparisonJS
			if(flag2 === 1)
			{
				// noinspection MagicNumberJS
				enc4 = 64;
			}
		}
		
		// noinspection NonBlockStatementBodyJS
		if(skipPadding)
		{
			// noinspection ConstantOnRightSideOfComparisonJS, NonBlockStatementBodyJS, MagicNumberJS
			if(enc3 === 64)
				output += `${template.charAt(enc1)}${template.charAt(enc2)}`;
			else
			{
				// noinspection ConstantOnRightSideOfComparisonJS, NonBlockStatementBodyJS, MagicNumberJS
				if(enc4 === 64)
					output += `${template.charAt(enc1)}${template.charAt(enc2)}${template.charAt(enc3)}`;
				else
					output += `${template.charAt(enc1)}${template.charAt(enc2)}${template.charAt(enc3)}${template.charAt(enc4)}`;
			}
		}
		else
			output += `${template.charAt(enc1)}${template.charAt(enc2)}${template.charAt(enc3)}${template.charAt(enc4)}`;
	}
	
	return output;
}
//**************************************************************************************
// noinspection FunctionWithMoreThanThreeNegationsJS, FunctionWithMultipleLoopsJS, OverlyComplexFunctionJS, FunctionNamingConventionJS
/**
 * Decode string from BASE64 (or "base64url")
 * @param {string} input
 * @param {boolean} [useUrlTemplate=false] If "true" then output would be encoded using "base64url"
 * @param {boolean} [cutTailZeros=false] If "true" then cut tailing zeroz from function result
 * @returns {string}
 */
function fromBase64(input, useUrlTemplate = false, cutTailZeros = false)
{
	// noinspection ConditionalExpressionJS
	const template = (useUrlTemplate) ? base64UrlTemplate : base64Template;
	
	//region Aux functions
	// noinspection FunctionWithMultipleReturnPointsJS, NestedFunctionJS
	function indexof(toSearch)
	{
		// noinspection ConstantOnRightSideOfComparisonJS, MagicNumberJS
		for(let i = 0; i < 64; i++)
		{
			// noinspection NonBlockStatementBodyJS
			if(template.charAt(i) === toSearch)
				return i;
		}
		
		// noinspection MagicNumberJS
		return 64;
	}
	
	// noinspection NestedFunctionJS
	function test(incoming)
	{
		// noinspection ConstantOnRightSideOfComparisonJS, ConditionalExpressionJS, MagicNumberJS
		return ((incoming === 64) ? 0x00 : incoming);
	}
	//endregion
	
	let i = 0;
	
	let output = "";
	
	while(i < input.length)
	{
		// noinspection NestedFunctionCallJS, LocalVariableNamingConventionJS, IncrementDecrementResultUsedJS
		const enc1 = indexof(input.charAt(i++));
		// noinspection NestedFunctionCallJS, LocalVariableNamingConventionJS, ConditionalExpressionJS, MagicNumberJS, IncrementDecrementResultUsedJS
		const enc2 = (i >= input.length) ? 0x00 : indexof(input.charAt(i++));
		// noinspection NestedFunctionCallJS, LocalVariableNamingConventionJS, ConditionalExpressionJS, MagicNumberJS, IncrementDecrementResultUsedJS
		const enc3 = (i >= input.length) ? 0x00 : indexof(input.charAt(i++));
		// noinspection NestedFunctionCallJS, LocalVariableNamingConventionJS, ConditionalExpressionJS, MagicNumberJS, IncrementDecrementResultUsedJS
		const enc4 = (i >= input.length) ? 0x00 : indexof(input.charAt(i++));
		
		// noinspection LocalVariableNamingConventionJS, NonShortCircuitBooleanExpressionJS
		const chr1 = (test(enc1) << 2) | (test(enc2) >> 4);
		// noinspection LocalVariableNamingConventionJS, MagicNumberJS, NonShortCircuitBooleanExpressionJS
		const chr2 = ((test(enc2) & 0x0F) << 4) | (test(enc3) >> 2);
		// noinspection LocalVariableNamingConventionJS, MagicNumberJS, NonShortCircuitBooleanExpressionJS
		const chr3 = ((test(enc3) & 0x03) << 6) | test(enc4);
		
		output += String.fromCharCode(chr1);
		
		// noinspection ConstantOnRightSideOfComparisonJS, NonBlockStatementBodyJS, MagicNumberJS
		if(enc3 !== 64)
			output += String.fromCharCode(chr2);
		
		// noinspection ConstantOnRightSideOfComparisonJS, NonBlockStatementBodyJS, MagicNumberJS
		if(enc4 !== 64)
			output += String.fromCharCode(chr3);
	}
	
	if(cutTailZeros)
	{
		const outputLength = output.length;
		let nonZeroStart = (-1);
		
		// noinspection ConstantOnRightSideOfComparisonJS
		for(let i = (outputLength - 1); i >= 0; i--)
		{
			// noinspection ConstantOnRightSideOfComparisonJS
			if(output.charCodeAt(i) !== 0)
			{
				nonZeroStart = i;
				// noinspection BreakStatementJS
				break;
			}
		}
		
		// noinspection NonBlockStatementBodyJS, NegatedIfStatementJS
		if(nonZeroStart !== (-1))
			output = output.slice(0, nonZeroStart + 1);
		else
			output = "";
	}
	
	return output;
}
//**************************************************************************************
function arrayBufferToString(buffer)
{
	let resultString = "";
	const view = new Uint8Array(buffer);
	
	// noinspection NonBlockStatementBodyJS
	for(const element of view)
		resultString += String.fromCharCode(element);
	
	return resultString;
}
//**************************************************************************************
function stringToArrayBuffer(str)
{
	const stringLength = str.length;
	
	const resultBuffer = new ArrayBuffer(stringLength);
	const resultView = new Uint8Array(resultBuffer);
	
	// noinspection NonBlockStatementBodyJS
	for(let i = 0; i < stringLength; i++)
		resultView[i] = str.charCodeAt(i);
	
	return resultBuffer;
}
//**************************************************************************************
const log2 = Math.log(2);
//**************************************************************************************
// noinspection FunctionNamingConventionJS
/**
 * Get nearest to input length power of 2
 * @param {number} length Current length of existing array
 * @returns {number}
 */
function nearestPowerOf2(length)
{
	const base = (Math.log(length) / log2);
	
	const floor = Math.floor(base);
	const round = Math.round(base);
	
	// noinspection ConditionalExpressionJS
	return ((floor === round) ? floor : round);
}
//**************************************************************************************
/**
 * Delete properties by name from specified object
 * @param {Object} object Object to delete properties from
 * @param {Array.<string>} propsArray Array of properties names
 */
function clearProps(object, propsArray)
{
	for(const prop of propsArray)
		delete object[prop];
}
//**************************************************************************************


/***/ },

/***/ "./src/app/backend-api/identity-registry/autogen/model/Organization.ts":
/***/ function(module, exports) {

"use strict";
/**
 * Maritime Connectivity Platform Identity Registry API
 * MCP Identity Registry API can be used for managing entities in the Maritime Connectivity Platform.
 *
 * OpenAPI spec version: 0.7.0
 * Contact: info@maritimecloud.net
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
"use strict";
var Organization;
(function (Organization) {
    (function (FederationTypeEnum) {
        FederationTypeEnum[FederationTypeEnum["TestIdp"] = 'test-idp'] = "TestIdp";
        FederationTypeEnum[FederationTypeEnum["OwnIdp"] = 'own-idp'] = "OwnIdp";
        FederationTypeEnum[FederationTypeEnum["ExternalIdp"] = 'external-idp'] = "ExternalIdp";
    })(Organization.FederationTypeEnum || (Organization.FederationTypeEnum = {}));
    var FederationTypeEnum = Organization.FederationTypeEnum;
})(Organization = exports.Organization || (exports.Organization = {}));


/***/ },

/***/ "./src/app/backend-api/identity-registry/autogen/model/Service.ts":
/***/ function(module, exports) {

"use strict";
/**
 * Maritime Connectivity Platform Identity Registry API
 * MCP Identity Registry API can be used for managing entities in the Maritime Connectivity Platform.
 *
 * OpenAPI spec version: 0.7.0
 * Contact: info@maritimecloud.net
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
"use strict";
var Service;
(function (Service) {
    (function (OidcAccessTypeEnum) {
        OidcAccessTypeEnum[OidcAccessTypeEnum["Public"] = 'public'] = "Public";
        OidcAccessTypeEnum[OidcAccessTypeEnum["BearerOnly"] = 'bearer-only'] = "BearerOnly";
        OidcAccessTypeEnum[OidcAccessTypeEnum["Confidential"] = 'confidential'] = "Confidential";
    })(Service.OidcAccessTypeEnum || (Service.OidcAccessTypeEnum = {}));
    var OidcAccessTypeEnum = Service.OidcAccessTypeEnum;
})(Service = exports.Service || (exports.Service = {}));


/***/ },

/***/ "./src/app/backend-api/identity-registry/autogen/model/VesselAttribute.ts":
/***/ function(module, exports) {

"use strict";
/**
 * Maritime Connectivity Platform Identity Registry API
 * MCP Identity Registry API can be used for managing entities in the Maritime Connectivity Platform.
 *
 * OpenAPI spec version: 0.7.0
 * Contact: info@maritimecloud.net
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
"use strict";
var VesselAttribute;
(function (VesselAttribute) {
    (function (AttributeNameEnum) {
        AttributeNameEnum[AttributeNameEnum["ImoNumber"] = 'imo-number'] = "ImoNumber";
        AttributeNameEnum[AttributeNameEnum["MmsiNumber"] = 'mmsi-number'] = "MmsiNumber";
        AttributeNameEnum[AttributeNameEnum["Callsign"] = 'callsign'] = "Callsign";
        AttributeNameEnum[AttributeNameEnum["Flagstate"] = 'flagstate'] = "Flagstate";
        AttributeNameEnum[AttributeNameEnum["AisClass"] = 'ais-class'] = "AisClass";
        AttributeNameEnum[AttributeNameEnum["PortOfRegister"] = 'port-of-register'] = "PortOfRegister";
    })(VesselAttribute.AttributeNameEnum || (VesselAttribute.AttributeNameEnum = {}));
    var AttributeNameEnum = VesselAttribute.AttributeNameEnum;
})(VesselAttribute = exports.VesselAttribute || (exports.VesselAttribute = {}));


/***/ },

/***/ "./src/app/pages/org-identity-registry/services/components/service-details/service-details.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var mc_notifications_service_1 = __webpack_require__("./src/app/shared/mc-notifications.service.ts");
var id_services_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/id-services.service.ts");
var navigation_helper_service_1 = __webpack_require__("./src/app/shared/navigation-helper.service.ts");
var ServiceDetailsComponent = (function () {
    function ServiceDetailsComponent(route, servicesService, router, notifications, navigationHelper) {
        this.route = route;
        this.servicesService = servicesService;
        this.router = router;
        this.notifications = notifications;
        this.navigationHelper = navigationHelper;
        this.showModal = false;
    }
    ServiceDetailsComponent.prototype.ngOnInit = function () {
        this.loadService();
    };
    ServiceDetailsComponent.prototype.loadService = function () {
        var _this = this;
        this.isLoading = true;
        var mrn = this.route.snapshot.params['id'];
        var version = this.route.snapshot.queryParams['serviceVersion'];
        this.servicesService.getIdService(mrn, version).subscribe(function (service) {
            _this.service = service;
            _this.title = service.name;
            _this.isLoading = false;
        }, function (err) {
            _this.isLoading = false;
            _this.notifications.generateNotification('Error', 'Error when trying to get the service', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    ServiceDetailsComponent.prototype.update = function () {
        this.navigationHelper.navigateToUpdateIdService(this.service.mrn, this.service.instanceVersion);
    };
    ServiceDetailsComponent.prototype.delete = function () {
        this.modalDescription = 'Are you sure you want to delete the service?';
        this.showModal = true;
    };
    ServiceDetailsComponent.prototype.cancelModal = function () {
        this.showModal = false;
    };
    ServiceDetailsComponent.prototype.deleteForSure = function () {
        var _this = this;
        this.isLoading = true;
        this.showModal = false;
        this.servicesService.deleteIdService(this.service.mrn, this.service.instanceVersion).subscribe(function () {
            _this.router.navigate(['../'], { relativeTo: _this.route });
        }, function (err) {
            _this.isLoading = false;
            _this.notifications.generateNotification('Error', 'Error when trying to delete the service', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    ServiceDetailsComponent = __decorate([
        core_1.Component({
            selector: 'service-details',
            encapsulation: core_1.ViewEncapsulation.None,
            template: __webpack_require__("./src/app/pages/org-identity-registry/services/components/service-details/service-details.html"),
            styles: []
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof router_1.ActivatedRoute !== 'undefined' && router_1.ActivatedRoute) === 'function' && _a) || Object, (typeof (_b = typeof id_services_service_1.IdServicesService !== 'undefined' && id_services_service_1.IdServicesService) === 'function' && _b) || Object, (typeof (_c = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _c) || Object, (typeof (_d = typeof mc_notifications_service_1.MCNotificationsService !== 'undefined' && mc_notifications_service_1.MCNotificationsService) === 'function' && _d) || Object, (typeof (_e = typeof navigation_helper_service_1.NavigationHelperService !== 'undefined' && navigation_helper_service_1.NavigationHelperService) === 'function' && _e) || Object])
    ], ServiceDetailsComponent);
    return ServiceDetailsComponent;
    var _a, _b, _c, _d, _e;
}());
exports.ServiceDetailsComponent = ServiceDetailsComponent;


/***/ },

/***/ "./src/app/pages/org-identity-registry/services/components/service-details/service-details.html":
/***/ function(module, exports) {

module.exports = "<div class=\"row\">\n  <div class=\"col-lg-12\">\n    <service-details-view [shouldShowDelete]=\"true\" (updateAction)=\"update()\" (deleteAction)=\"delete()\" [isLoading]=\"isLoading\" [title]=\"title\" [service]=\"service\"></service-details-view>\n  </div>\n</div>\n<mc-modal (onCancel)=\"cancelModal()\" (onOk)=\"deleteForSure()\" [show]=\"showModal\" [title]=\"'Delete service'\" [description]=\"modalDescription\" [cancelClass]=\"'btn btn-default btn-raised'\" [cancelTitle]=\"'Cancel'\" [okClass]=\"'btn btn-danger btn-raised'\" [okTitle]=\"'Delete'\"></mc-modal>\n"

/***/ },

/***/ "./src/app/pages/org-identity-registry/services/components/service-list/service-list.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var mc_notifications_service_1 = __webpack_require__("./src/app/shared/mc-notifications.service.ts");
var organizations_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/organizations.service.ts");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var auth_service_1 = __webpack_require__("./src/app/authentication/services/auth.service.ts");
var rxjs_1 = __webpack_require__("./node_modules/rxjs/Rx.js");
var id_services_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/id-services.service.ts");
var navigation_helper_service_1 = __webpack_require__("./src/app/shared/navigation-helper.service.ts");
var app_constants_1 = __webpack_require__("./src/app/shared/app.constants.ts");
var ServiceListComponent = (function () {
    function ServiceListComponent(authService, router, route, servicesService, orgService, notifications, navigationHelper) {
        this.authService = authService;
        this.router = router;
        this.route = route;
        this.servicesService = servicesService;
        this.orgService = orgService;
        this.notifications = notifications;
        this.navigationHelper = navigationHelper;
        this.KEY_NEW = 'KEY_NEW_SERVICE';
    }
    ServiceListComponent.prototype.ngOnInit = function () {
        this.isLoading = true;
        this.loadMyOrganization();
        this.loadServices();
    };
    ServiceListComponent.prototype.loadMyOrganization = function () {
        var _this = this;
        this.orgService.getMyOrganization().subscribe(function (organization) {
            _this.organization = organization;
        }, function (err) {
            _this.notifications.generateNotification('Error', 'Error when trying to get organization', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    ServiceListComponent.prototype.loadServices = function () {
        var _this = this;
        this.servicesService.getIdServices().subscribe(function (pageService) {
            _this.services = pageService.content;
            _this.isLoading = false;
            _this.generateEntityImageList();
        }, function (err) {
            _this.isLoading = false;
            _this.notifications.generateNotification('Error', 'Error when trying to get services', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    ServiceListComponent.prototype.gotoDetails = function (entityModel) {
        if (entityModel.entityId === this.KEY_NEW) {
            this.navigationHelper.navigateToCreateIdService();
        }
        else {
            var serviceMrnAndVersion = entityModel.entityId.split(app_constants_1.TOKEN_DELIMITER);
            this.navigationHelper.navigateToService(serviceMrnAndVersion[0], serviceMrnAndVersion[1]);
        }
    };
    ServiceListComponent.prototype.generateEntityImageList = function () {
        var _this = this;
        this.entityImageList = [];
        if (this.services) {
            this.services.forEach(function (service) {
                if (service.instanceVersion) {
                    _this.entityImageList.push({ imageSourceObservable: _this.createImgObservable(service), entityId: service.mrn + app_constants_1.TOKEN_DELIMITER + service.instanceVersion, title: service.name });
                }
            });
        }
        if (this.authService.authState.hasPermission(auth_service_1.AuthPermission.ServiceAdmin)) {
            this.entityImageList.push({ imageSourceObservable: null, entityId: this.KEY_NEW, title: 'Register new Service', isAdd: true });
        }
    };
    ServiceListComponent.prototype.createImgObservable = function (service) {
        var imageSrc = 'assets/img/no_service.svg';
        return rxjs_1.Observable.create(function (observer) {
            observer.next(imageSrc);
        });
    };
    ServiceListComponent = __decorate([
        core_1.Component({
            selector: 'service-list',
            encapsulation: core_1.ViewEncapsulation.None,
            template: __webpack_require__("./src/app/pages/org-identity-registry/services/components/service-list/service-list.html"),
            styles: []
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof auth_service_1.AuthService !== 'undefined' && auth_service_1.AuthService) === 'function' && _a) || Object, (typeof (_b = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _b) || Object, (typeof (_c = typeof router_1.ActivatedRoute !== 'undefined' && router_1.ActivatedRoute) === 'function' && _c) || Object, (typeof (_d = typeof id_services_service_1.IdServicesService !== 'undefined' && id_services_service_1.IdServicesService) === 'function' && _d) || Object, (typeof (_e = typeof organizations_service_1.OrganizationsService !== 'undefined' && organizations_service_1.OrganizationsService) === 'function' && _e) || Object, (typeof (_f = typeof mc_notifications_service_1.MCNotificationsService !== 'undefined' && mc_notifications_service_1.MCNotificationsService) === 'function' && _f) || Object, (typeof (_g = typeof navigation_helper_service_1.NavigationHelperService !== 'undefined' && navigation_helper_service_1.NavigationHelperService) === 'function' && _g) || Object])
    ], ServiceListComponent);
    return ServiceListComponent;
    var _a, _b, _c, _d, _e, _f, _g;
}());
exports.ServiceListComponent = ServiceListComponent;


/***/ },

/***/ "./src/app/pages/org-identity-registry/services/components/service-list/service-list.html":
/***/ function(module, exports) {

module.exports = "<div class=\"row\">\n  <div class=\"col-lg-12\">\n    <ba-card title=\"Services for {{organization?.name}}\" baCardClass=\"with-scroll table-panel\">\n      <mc-entity-image-list [isLoading]=\"isLoading\" [entityImageList]=\"entityImageList\" (onClick)=\"gotoDetails($event)\"></mc-entity-image-list>\n    </ba-card>\n  </div>\n</div>\n"

/***/ },

/***/ "./src/app/pages/org-identity-registry/services/components/service-new/service-new.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var navigation_helper_service_1 = __webpack_require__("./src/app/shared/navigation-helper.service.ts");
var mc_notifications_service_1 = __webpack_require__("./src/app/shared/mc-notifications.service.ts");
var organizations_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/organizations.service.ts");
var forms_1 = __webpack_require__("./node_modules/@angular/forms/index.js");
var mrn_helper_service_1 = __webpack_require__("./src/app/shared/mrn-helper.service.ts");
var mcFormControlModel_1 = __webpack_require__("./src/app/theme/components/mcForm/mcFormControlModel.ts");
var id_services_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/id-services.service.ts");
var Service_1 = __webpack_require__("./src/app/backend-api/identity-registry/autogen/model/Service.ts");
var ServiceViewModel_1 = __webpack_require__("./src/app/pages/org-identity-registry/services/view-models/ServiceViewModel.ts");
var select_validator_1 = __webpack_require__("./src/app/theme/validators/select.validator.ts");
var OidcAccessTypeEnum = Service_1.Service.OidcAccessTypeEnum;
var vessel_helper_1 = __webpack_require__("./src/app/pages/shared/services/vessel-helper.ts");
var vessels_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/vessels.service.ts");
var ServiceNewComponent = (function () {
    function ServiceNewComponent(formBuilder, activatedRoute, navigationService, notifications, orgService, servicesService, mrnHelper, vesselsService) {
        this.formBuilder = formBuilder;
        this.activatedRoute = activatedRoute;
        this.navigationService = navigationService;
        this.notifications = notifications;
        this.orgService = orgService;
        this.servicesService = servicesService;
        this.vesselsService = vesselsService;
        this.isPrefilled = false;
        // McForm params
        this.useOIDCRedirect = true;
        this.useOIDC = false;
        this.oidcAccessType = null;
        this.linkToVessel = false;
        this.isLoading = true;
        this.isRegistering = false;
        this.registerTitle = "Register Service";
        this.registerButtonClass = "btn btn-danger btn-raised";
        this.mrnMask = mrnHelper.mrnMaskForInstance();
        this.mrnPattern = mrnHelper.mrnPattern();
        this.mrnPatternError = mrnHelper.mrnPatternError();
        this.mrn = this.mrnMask;
    }
    ServiceNewComponent.prototype.ngOnInit = function () {
        this.onRegister = this.register.bind(this);
        this.isRegistering = false;
        this.isLoading = true;
        var mrn = this.activatedRoute.snapshot.queryParams['mrn'];
        var name = this.activatedRoute.snapshot.queryParams['name'];
        var instanceVersion = this.activatedRoute.snapshot.queryParams['instanceVersion'];
        if (name && mrn && instanceVersion) {
            this.isPrefilled = true;
            this.mrn = mrn;
            this.name = name;
            this.instanceVersion = instanceVersion;
        }
        this.loadMyOrganization();
    };
    ServiceNewComponent.prototype.cancel = function () {
        this.navigationService.cancelCreateService();
    };
    ServiceNewComponent.prototype.register = function () {
        this.isRegistering = true;
        var service = {
            mrn: this.mrn,
            name: this.registerForm.value.name,
            instanceVersion: this.registerForm.value.instanceVersion,
            permissions: this.registerForm.value.permissions,
            certDomainName: this.registerForm.value.certDomainName
        };
        if (this.useOIDC) {
            if (this.useOIDCRedirect) {
                service.oidcRedirectUri = this.registerForm.value.oidcRedirectUri;
            }
            else {
                service.oidcRedirectUri = '';
            }
            var oidcAccessType = this.registerForm.value.oidcAccessType;
            if (oidcAccessType && oidcAccessType.toLowerCase().indexOf('undefined') < 0) {
                service.oidcAccessType = oidcAccessType;
            }
        }
        else {
            service.oidcAccessType = null;
            service.oidcRedirectUri = null;
        }
        if (this.linkToVessel) {
            service.vessel = this.vessel;
        }
        this.createService(service);
    };
    ServiceNewComponent.prototype.createService = function (service) {
        var _this = this;
        this.servicesService.createIdService(service).subscribe(function (service) {
            if (_this.isPrefilled) {
                _this.cancel();
            }
            else {
                _this.navigationService.navigateToService(service.mrn, service.instanceVersion);
            }
            _this.isRegistering = false;
        }, function (err) {
            _this.isRegistering = false;
            _this.notifications.generateNotification('Error', 'Error when trying to create service', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    ServiceNewComponent.prototype.loadMyOrganization = function () {
        var _this = this;
        this.orgService.getMyOrganization().subscribe(function (organization) {
            _this.organization = organization;
            _this.loadVessels();
        }, function (err) {
            _this.isLoading = false;
            _this.notifications.generateNotification('Error', 'Error when trying to get organization', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    ServiceNewComponent.prototype.loadVessels = function () {
        var _this = this;
        this.vesselsService.getVessels().subscribe(function (pageVessel) {
            _this.vessels = pageVessel.content;
            _this.generateForm();
            _this.isLoading = false;
        }, function (error) {
            _this.notifications.generateNotification('Error', 'Error when trying to get vessels for the service', mc_notifications_service_1.MCNotificationType.Error, error);
            _this.cancel();
        });
    };
    ServiceNewComponent.prototype.shouldLinkToVessel = function (linkToVessel) {
        this.linkToVessel = linkToVessel;
        this.generateForm();
    };
    ServiceNewComponent.prototype.shouldUseOIDCRedirect = function (value) {
        if (value && this.oidcAccessType != value) {
            this.oidcAccessType = value;
            this.useOIDCRedirect = value != OidcAccessTypeEnum.BearerOnly;
            this.generateForm();
        }
    };
    ServiceNewComponent.prototype.shouldUseOIDC = function (useOIDC) {
        this.useOIDC = useOIDC;
        this.generateForm();
    };
    ServiceNewComponent.prototype.generateMRN = function (idValue) {
        var mrn = (idValue ? idValue : '');
        var valueNoSpaces = mrn.split(' ').join('').toLowerCase();
        this.mrn = this.mrnMask + valueNoSpaces;
        this.registerForm.patchValue({ mrn: this.mrn });
    };
    ServiceNewComponent.prototype.isFormValid = function () {
        var oidcTypeValid = true;
        var oidcAccessType = this.registerForm.value.oidcAccessType;
        if (this.useOIDC && (!oidcAccessType || oidcAccessType.toLowerCase().indexOf('undefined') >= 0)) {
            oidcTypeValid = false;
        }
        return this.registerForm.valid && oidcTypeValid;
    };
    ServiceNewComponent.prototype.generateForm = function () {
        var _this = this;
        var oldForm = this.registerForm;
        this.registerForm = this.formBuilder.group({});
        if (!oldForm) {
            oldForm = this.registerForm;
        }
        this.formControlModels = [];
        var formControlModel = { formGroup: this.registerForm, elementId: 'mrn', controlType: mcFormControlModel_1.McFormControlType.Text, labelName: 'MRN', placeholder: '', isDisabled: true };
        var formControl = new forms_1.FormControl(this.mrn, formControlModel.validator);
        this.registerForm.addControl(formControlModel.elementId, formControl);
        this.formControlModels.push(formControlModel);
        if (!this.isPrefilled) {
            formControlModel = { formGroup: this.registerForm, elementId: 'serviceId', controlType: mcFormControlModel_1.McFormControlType.Text, labelName: 'Service ID', placeholder: 'Enter Service ID to generate MRN', validator: forms_1.Validators.required, pattern: this.mrnPattern, errorText: this.mrnPatternError };
            formControl = new forms_1.FormControl(oldForm.value.serviceId, formControlModel.validator);
            formControl.valueChanges.subscribe(function (param) { return _this.generateMRN(param); });
            this.registerForm.addControl(formControlModel.elementId, formControl);
            this.formControlModels.push(formControlModel);
        }
        if (this.isPrefilled) {
            formControlModel = { formGroup: this.registerForm, elementId: 'name', controlType: mcFormControlModel_1.McFormControlType.Text, labelName: 'Name', placeholder: '', isDisabled: true };
            formControl = new forms_1.FormControl(this.name, formControlModel.validator);
        }
        else {
            formControlModel = { formGroup: this.registerForm, elementId: 'name', controlType: mcFormControlModel_1.McFormControlType.Text, labelName: 'Name', placeholder: 'Name is required', validator: forms_1.Validators.required };
            formControl = new forms_1.FormControl(oldForm.value.name, formControlModel.validator);
        }
        this.registerForm.addControl(formControlModel.elementId, formControl);
        this.formControlModels.push(formControlModel);
        if (this.isPrefilled) {
            formControlModel = { formGroup: this.registerForm, elementId: 'instanceVersion', controlType: mcFormControlModel_1.McFormControlType.Text, labelName: 'Version', placeholder: '', isDisabled: true };
            formControl = new forms_1.FormControl(this.instanceVersion, formControlModel.validator);
        }
        else {
            formControlModel = { formGroup: this.registerForm, elementId: 'instanceVersion', controlType: mcFormControlModel_1.McFormControlType.Text, labelName: 'Version', placeholder: 'Version is required', validator: forms_1.Validators.required };
            formControl = new forms_1.FormControl(oldForm.value.instanceVersion, formControlModel.validator);
        }
        this.registerForm.addControl(formControlModel.elementId, formControl);
        this.formControlModels.push(formControlModel);
        formControlModel = { formGroup: this.registerForm, elementId: 'permissions', controlType: mcFormControlModel_1.McFormControlType.Text, labelName: 'Permissions', placeholder: '' };
        formControl = new forms_1.FormControl(oldForm.value.permissions, formControlModel.validator);
        this.registerForm.addControl(formControlModel.elementId, formControl);
        this.formControlModels.push(formControlModel);
        formControlModel = { formGroup: this.registerForm, elementId: 'certDomainName', controlType: mcFormControlModel_1.McFormControlType.Text, labelName: 'Certificate domain name', placeholder: '' };
        formControl = new forms_1.FormControl(oldForm.value.certDomainName, formControlModel.validator);
        this.registerForm.addControl(formControlModel.elementId, formControl);
        this.formControlModels.push(formControlModel);
        var formControlModelCheckbox = { state: this.useOIDC, formGroup: this.registerForm, elementId: 'useOIDC', controlType: mcFormControlModel_1.McFormControlType.Checkbox, labelName: 'Use OpenID Connect (OIDC)' };
        formControl = new forms_1.FormControl({ value: formControlModelCheckbox.state, disabled: false }, formControlModelCheckbox.validator);
        formControl.valueChanges.subscribe(function (param) { return _this.shouldUseOIDC(param); });
        this.registerForm.addControl(formControlModelCheckbox.elementId, formControl);
        this.formControlModels.push(formControlModelCheckbox);
        if (this.useOIDC) {
            var selectValues = this.selectValues();
            var formControlModelSelect = { selectValues: selectValues, formGroup: this.registerForm, elementId: 'oidcAccessType', controlType: mcFormControlModel_1.McFormControlType.Select, labelName: 'Access type', placeholder: '', validator: select_validator_1.SelectValidator.validate, showCheckmark: true };
            formControl = new forms_1.FormControl(this.selectedValue(selectValues), formControlModelSelect.validator);
            formControl.valueChanges.subscribe(function (param) { return _this.shouldUseOIDCRedirect(param); });
            this.registerForm.addControl(formControlModelSelect.elementId, formControl);
            this.formControlModels.push(formControlModelSelect);
            if (this.useOIDCRedirect) {
                formControlModel = { formGroup: this.registerForm, elementId: 'oidcRedirectUri', controlType: mcFormControlModel_1.McFormControlType.Text, labelName: 'OIDC Redirect URI', placeholder: '', validator: forms_1.Validators.required, errorText: 'URI is required' };
                formControl = new forms_1.FormControl(oldForm.value.oidcRedirectUri, formControlModel.validator);
                this.registerForm.addControl(formControlModel.elementId, formControl);
                this.formControlModels.push(formControlModel);
            }
        }
        var linkToVesselCheckbox = { state: this.linkToVessel, formGroup: this.registerForm, elementId: 'linkToVessel', controlType: mcFormControlModel_1.McFormControlType.Checkbox, labelName: 'Link to a vessel' };
        formControl = new forms_1.FormControl({ value: linkToVesselCheckbox.state, disabled: false }, linkToVesselCheckbox.validator);
        formControl.valueChanges.subscribe(function (param) { return _this.shouldLinkToVessel(param); });
        this.registerForm.addControl(linkToVesselCheckbox.elementId, formControl);
        this.formControlModels.push(linkToVesselCheckbox);
        if (this.linkToVessel) {
            var selectValues = this.vesselSelectValues();
            var vesselSelect = { selectValues: selectValues, formGroup: this.registerForm, elementId: 'vesselSelect', controlType: mcFormControlModel_1.McFormControlType.Select, validator: null, labelName: 'Vessel', placeholder: '', showCheckmark: false, requireGroupValid: false };
            formControl = new forms_1.FormControl(this.selectedValue(selectValues), vesselSelect.validator);
            formControl.valueChanges.subscribe(function (param) {
                if (param) {
                    _this.vessel = param;
                }
            });
            this.registerForm.addControl(vesselSelect.elementId, formControl);
            this.formControlModels.push(vesselSelect);
        }
    };
    ServiceNewComponent.prototype.selectValues = function () {
        var _this = this;
        var selectValues = [];
        selectValues.push({ value: undefined, label: 'Choose access type...', isSelected: this.oidcAccessType == null });
        var allOidcTypes = ServiceViewModel_1.ServiceViewModel.getAllOidcAccessTypes();
        allOidcTypes.forEach(function (oidcType) {
            var isSelected = OidcAccessTypeEnum[oidcType.value] === OidcAccessTypeEnum[_this.oidcAccessType];
            selectValues.push({ value: oidcType.value, label: oidcType.label, isSelected: isSelected });
        });
        return selectValues;
    };
    ServiceNewComponent.prototype.vesselSelectValues = function () {
        var _this = this;
        var selectValues = [];
        var defaultSelected = true;
        if (this.vessels && this.vessels.length > 0) {
            this.vessels.forEach(function (vessel) {
                var isSelected = false;
                if (_this.vessel) {
                    isSelected = _this.vessel.mrn === vessel.mrn;
                }
                else {
                    isSelected = defaultSelected;
                    defaultSelected = false;
                }
                selectValues.push({ value: vessel, label: vessel_helper_1.VesselHelper.labelForSelect(vessel), isSelected: isSelected });
            });
        }
        return selectValues;
    };
    ServiceNewComponent.prototype.selectedValue = function (selectValues) {
        for (var _i = 0, selectValues_1 = selectValues; _i < selectValues_1.length; _i++) {
            var selectModel = selectValues_1[_i];
            if (selectModel.isSelected) {
                return selectModel.value;
            }
        }
        return '';
    };
    ServiceNewComponent = __decorate([
        core_1.Component({
            selector: 'service-new',
            encapsulation: core_1.ViewEncapsulation.None,
            template: __webpack_require__("./src/app/pages/org-identity-registry/services/components/service-new/service-new.html"),
            styles: []
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof forms_1.FormBuilder !== 'undefined' && forms_1.FormBuilder) === 'function' && _a) || Object, (typeof (_b = typeof router_1.ActivatedRoute !== 'undefined' && router_1.ActivatedRoute) === 'function' && _b) || Object, (typeof (_c = typeof navigation_helper_service_1.NavigationHelperService !== 'undefined' && navigation_helper_service_1.NavigationHelperService) === 'function' && _c) || Object, (typeof (_d = typeof mc_notifications_service_1.MCNotificationsService !== 'undefined' && mc_notifications_service_1.MCNotificationsService) === 'function' && _d) || Object, (typeof (_e = typeof organizations_service_1.OrganizationsService !== 'undefined' && organizations_service_1.OrganizationsService) === 'function' && _e) || Object, (typeof (_f = typeof id_services_service_1.IdServicesService !== 'undefined' && id_services_service_1.IdServicesService) === 'function' && _f) || Object, (typeof (_g = typeof mrn_helper_service_1.MrnHelperService !== 'undefined' && mrn_helper_service_1.MrnHelperService) === 'function' && _g) || Object, (typeof (_h = typeof vessels_service_1.VesselsService !== 'undefined' && vessels_service_1.VesselsService) === 'function' && _h) || Object])
    ], ServiceNewComponent);
    return ServiceNewComponent;
    var _a, _b, _c, _d, _e, _f, _g, _h;
}());
exports.ServiceNewComponent = ServiceNewComponent;


/***/ },

/***/ "./src/app/pages/org-identity-registry/services/components/service-new/service-new.html":
/***/ function(module, exports) {

module.exports = "<div class=\"row\">\n  <div class=\"col-lg-12\">\n    <ba-card title=\"Register new Service for {{organization?.name}}\" baCardClass=\"with-scroll table-panel\">\n      <mc-form [hideButtons]=\"true\" [formGroup]=\"registerForm\" [formControlModels]=\"formControlModels\" [isLoading]=\"isLoading\"></mc-form>\n\n      <ul *ngIf=\"registerForm\" class=\"btn-list clearfix\">\n        <li>\n          <mc-loading-button [class]=\"registerButtonClass\" [disabled]=\"!isFormValid()\" [isLoading]=\"isRegistering\" [title]=\"registerTitle\" [onClick]=\"onRegister\" ></mc-loading-button>\n        </li>\n        <li>\n          <button type=\"button\" class=\"btn btn-default btn-raised\" (click)=\"cancel()\">Cancel</button>\n        </li>\n      </ul>\n    </ba-card>\n  </div>\n</div>\n"

/***/ },

/***/ "./src/app/pages/org-identity-registry/services/components/service-update/service-update.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var navigation_helper_service_1 = __webpack_require__("./src/app/shared/navigation-helper.service.ts");
var mc_notifications_service_1 = __webpack_require__("./src/app/shared/mc-notifications.service.ts");
var forms_1 = __webpack_require__("./node_modules/@angular/forms/index.js");
var mrn_helper_service_1 = __webpack_require__("./src/app/shared/mrn-helper.service.ts");
var mcFormControlModel_1 = __webpack_require__("./src/app/theme/components/mcForm/mcFormControlModel.ts");
var id_services_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/id-services.service.ts");
var Service_1 = __webpack_require__("./src/app/backend-api/identity-registry/autogen/model/Service.ts");
var ServiceViewModel_1 = __webpack_require__("./src/app/pages/org-identity-registry/services/view-models/ServiceViewModel.ts");
var select_validator_1 = __webpack_require__("./src/app/theme/validators/select.validator.ts");
var OidcAccessTypeEnum = Service_1.Service.OidcAccessTypeEnum;
var util_1 = __webpack_require__("./node_modules/util/util.js");
var vessels_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/vessels.service.ts");
var vessel_helper_1 = __webpack_require__("./src/app/pages/shared/services/vessel-helper.ts");
var ServiceUpdateComponent = (function () {
    function ServiceUpdateComponent(formBuilder, activatedRoute, navigationService, notifications, servicesService, mrnHelper, vesselsService) {
        this.formBuilder = formBuilder;
        this.activatedRoute = activatedRoute;
        this.navigationService = navigationService;
        this.notifications = notifications;
        this.servicesService = servicesService;
        this.vesselsService = vesselsService;
        this.showModal = false;
        this.showModalVesselAtt = false;
        // McForm params
        this.useOIDC = false;
        this.useOIDCRedirect = true;
        this.linkToVessel = false;
        this.isLoading = true;
        this.isUpdating = false;
        this.updateTitle = "Update";
    }
    ServiceUpdateComponent.prototype.ngOnInit = function () {
        this.isUpdating = false;
        this.isLoading = true;
        this.loadIdService();
    };
    ServiceUpdateComponent.prototype.loadIdService = function () {
        var _this = this;
        var mrn = this.activatedRoute.snapshot.params['id'];
        var version = this.activatedRoute.snapshot.queryParams['instanceVersion'];
        this.servicesService.getIdService(mrn, version).subscribe(function (idService) {
            _this.idService = idService;
            _this.useOIDC = _this.idService.oidcAccessType != undefined;
            _this.useOIDCRedirect = (_this.idService.oidcAccessType && _this.idService.oidcAccessType != OidcAccessTypeEnum.BearerOnly);
            _this.linkToVessel = !util_1.isNullOrUndefined(_this.idService.vessel);
            _this.permissions = _this.idService.permissions;
            _this.certDomainName = _this.idService.certDomainName;
            _this.oidcRedirectUri = _this.idService.oidcRedirectUri;
            if (_this.linkToVessel) {
                _this.vessel = _this.idService.vessel;
            }
            _this.loadVessels();
        }, function (err) {
            _this.notifications.generateNotification('Error', 'Error when trying to get the service', mc_notifications_service_1.MCNotificationType.Error, err);
            _this.navigationService.navigateToService(mrn, version);
        });
    };
    ServiceUpdateComponent.prototype.loadVessels = function () {
        var _this = this;
        this.vesselsService.getVessels().subscribe(function (pageVessel) {
            _this.vessels = pageVessel.content;
            _this.generateForm();
            _this.isLoading = false;
        }, function (error) {
            _this.notifications.generateNotification('Error', 'Error when trying to get vessels for the service', mc_notifications_service_1.MCNotificationType.Error, error);
            _this.navigationService.navigateToService(_this.idService.mrn, _this.idService.instanceVersion);
        });
    };
    ServiceUpdateComponent.prototype.cancel = function () {
        this.navigationService.gobackFromUpdateService();
    };
    ServiceUpdateComponent.prototype.update = function () {
        if (this.hasActiveCertificate()) {
            this.modalDescription = "<b>Certificates</b> will be <b>invalid</b> if you update the service.<br>You need to revoke the certificates and issue new ones.<br><br>Would you still like to update?";
            this.showModal = true;
        }
        else {
            this.showVesselAttWarning();
        }
    };
    ServiceUpdateComponent.prototype.showVesselAttWarning = function () {
        if (this.linkToVessel && this.isNewVessel()) {
            this.showModal = false;
            this.modalDescription = "The linked Vessel has changed. You should change the IMO and MMSI in the Instance XML as well.<br><br>Would you still like to update?";
            this.showModalVesselAtt = true;
        }
        else {
            this.updateForSure();
        }
    };
    ServiceUpdateComponent.prototype.isNewVessel = function () {
        if (this.vessel && this.idService.vessel) {
            return this.vessel.mrn !== this.idService.vessel.mrn;
        }
        else {
            return true;
        }
    };
    ServiceUpdateComponent.prototype.hasActiveCertificate = function () {
        if (this.idService.certificates && this.idService.certificates.length > 0) {
            for (var _i = 0, _a = this.idService.certificates; _i < _a.length; _i++) {
                var certificate = _a[_i];
                if (!certificate.revoked) {
                    return true;
                }
            }
        }
        return false;
    };
    ServiceUpdateComponent.prototype.cancelModal = function () {
        this.showModal = false;
        this.showModalVesselAtt = false;
    };
    ServiceUpdateComponent.prototype.updateForSure = function () {
        this.isUpdating = true;
        this.updateValues(true);
        this.updateIdService(this.idService);
    };
    ServiceUpdateComponent.prototype.updateValues = function (overwriteOidc) {
        this.idService.name = this.updateForm.value.name;
        this.idService.permissions = this.updateForm.value.permissions;
        this.idService.certDomainName = this.updateForm.value.certDomainName;
        if (this.linkToVessel) {
            this.idService.vessel = this.updateForm.value.vesselSelect;
        }
        else {
            this.idService.vessel = null;
        }
        if (overwriteOidc) {
            if (this.useOIDC) {
                if (this.useOIDCRedirect) {
                    this.idService.oidcRedirectUri = this.updateForm.value.oidcRedirectUri;
                }
                else {
                    this.idService.oidcRedirectUri = '';
                }
                var oidcAccessType = this.updateForm.value.oidcAccessType;
                if (oidcAccessType && oidcAccessType.toLowerCase().indexOf('undefined') < 0) {
                    this.idService.oidcAccessType = oidcAccessType;
                }
                else {
                    this.idService.oidcAccessType = null;
                }
            }
            else {
                this.idService.oidcAccessType = null;
                this.idService.oidcRedirectUri = null;
                this.idService.oidcClientId = null;
                this.idService.oidcClientSecret = null;
            }
        }
    };
    ServiceUpdateComponent.prototype.updateIdService = function (service) {
        var _this = this;
        this.servicesService.updateIdService(service).subscribe(function (_) {
            _this.isUpdating = false;
            _this.navigationService.gobackFromUpdateService();
        }, function (err) {
            _this.isUpdating = false;
            _this.notifications.generateNotification('Error', 'Error when trying to update service', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    ServiceUpdateComponent.prototype.shouldUseOIDCRedirect = function (value) {
        if (value && this.idService.oidcAccessType != value) {
            this.idService.oidcAccessType = value;
            this.useOIDCRedirect = value != OidcAccessTypeEnum.BearerOnly;
            this.generateForm();
        }
    };
    ServiceUpdateComponent.prototype.shouldUseOIDC = function (useOIDC) {
        this.useOIDC = useOIDC;
        this.updateValues(false);
        this.generateForm();
    };
    ServiceUpdateComponent.prototype.shouldLinkToVessel = function (linkToVessel) {
        this.linkToVessel = linkToVessel;
        this.generateForm();
    };
    ServiceUpdateComponent.prototype.generateForm = function () {
        var _this = this;
        this.updateForm = this.formBuilder.group({});
        this.formControlModels = [];
        var formControlModel = { formGroup: this.updateForm, elementId: 'mrn', controlType: mcFormControlModel_1.McFormControlType.Text, labelName: 'MRN', placeholder: '', isDisabled: true };
        var formControl = new forms_1.FormControl(this.idService.mrn, formControlModel.validator);
        this.updateForm.addControl(formControlModel.elementId, formControl);
        this.formControlModels.push(formControlModel);
        formControlModel = { formGroup: this.updateForm, elementId: 'name', controlType: mcFormControlModel_1.McFormControlType.Text, labelName: 'Name', placeholder: '', isDisabled: true };
        formControl = new forms_1.FormControl(this.idService.name, formControlModel.validator);
        this.updateForm.addControl(formControlModel.elementId, formControl);
        this.formControlModels.push(formControlModel);
        formControlModel = { formGroup: this.updateForm, elementId: 'permissions', controlType: mcFormControlModel_1.McFormControlType.Text, labelName: 'Permissions', placeholder: '' };
        formControl = new forms_1.FormControl(this.permissions, formControlModel.validator);
        formControl.valueChanges.subscribe(function (param) { return _this.permissions = param; });
        this.updateForm.addControl(formControlModel.elementId, formControl);
        this.formControlModels.push(formControlModel);
        formControlModel = { formGroup: this.updateForm, elementId: 'certDomainName', controlType: mcFormControlModel_1.McFormControlType.Text, labelName: 'Certificate domain name', placeholder: '' };
        formControl = new forms_1.FormControl(this.certDomainName, formControlModel.validator);
        formControl.valueChanges.subscribe(function (param) { return _this.certDomainName = param; });
        this.updateForm.addControl(formControlModel.elementId, formControl);
        this.formControlModels.push(formControlModel);
        var formControlModelCheckbox = { state: this.useOIDC, formGroup: this.updateForm, elementId: 'useOIDC', controlType: mcFormControlModel_1.McFormControlType.Checkbox, labelName: 'Use OpenID Connect (OIDC)' };
        formControl = new forms_1.FormControl({ value: "\"" + formControlModelCheckbox.state + "\"", disabled: false }, formControlModelCheckbox.validator);
        formControl.valueChanges.subscribe(function (param) { return _this.shouldUseOIDC(param); });
        this.updateForm.addControl(formControlModelCheckbox.elementId, formControl);
        this.formControlModels.push(formControlModelCheckbox);
        if (this.useOIDC) {
            var selectValues = this.selectValues();
            var formControlModelSelect = { selectValues: selectValues, formGroup: this.updateForm, elementId: 'oidcAccessType', controlType: mcFormControlModel_1.McFormControlType.Select, labelName: 'Access type', placeholder: '', validator: select_validator_1.SelectValidator.validate, showCheckmark: true };
            formControl = new forms_1.FormControl(this.selectedValue(selectValues), formControlModelSelect.validator);
            formControl.valueChanges.subscribe(function (param) { return _this.shouldUseOIDCRedirect(param); });
            this.updateForm.addControl(formControlModelSelect.elementId, formControl);
            this.formControlModels.push(formControlModelSelect);
            if (this.useOIDCRedirect) {
                formControlModel = { formGroup: this.updateForm, elementId: 'oidcRedirectUri', controlType: mcFormControlModel_1.McFormControlType.Text, labelName: 'OIDC Redirect URI', placeholder: '', validator: forms_1.Validators.required, errorText: 'URI is required' };
                formControl = new forms_1.FormControl(this.oidcRedirectUri, formControlModel.validator);
                formControl.valueChanges.subscribe(function (param) { return _this.oidcRedirectUri = param; });
                this.updateForm.addControl(formControlModel.elementId, formControl);
                this.formControlModels.push(formControlModel);
            }
        }
        var linkToVesselCheckbox = { state: this.linkToVessel, formGroup: this.updateForm, elementId: 'linkToVessel', controlType: mcFormControlModel_1.McFormControlType.Checkbox, labelName: 'Link to a vessel' };
        formControl = new forms_1.FormControl({ value: linkToVesselCheckbox.state, disabled: false }, linkToVesselCheckbox.validator);
        formControl.valueChanges.subscribe(function (param) { return _this.shouldLinkToVessel(param); });
        this.updateForm.addControl(linkToVesselCheckbox.elementId, formControl);
        this.formControlModels.push(linkToVesselCheckbox);
        if (this.linkToVessel) {
            var selectValues = this.vesselSelectValues();
            var vesselSelect = { selectValues: selectValues, formGroup: this.updateForm, elementId: 'vesselSelect', controlType: mcFormControlModel_1.McFormControlType.Select, validator: null, labelName: 'Vessel', placeholder: '', showCheckmark: false, requireGroupValid: false };
            formControl = new forms_1.FormControl(this.selectedValue(selectValues));
            formControl.valueChanges.subscribe(function (param) {
                if (param) {
                    _this.vessel = param;
                }
            });
            this.updateForm.addControl(vesselSelect.elementId, formControl);
            this.formControlModels.push(vesselSelect);
        }
    };
    ServiceUpdateComponent.prototype.selectedValue = function (selectValues) {
        for (var _i = 0, selectValues_1 = selectValues; _i < selectValues_1.length; _i++) {
            var selectModel = selectValues_1[_i];
            if (selectModel.isSelected) {
                return selectModel.value;
            }
        }
        return '';
    };
    ServiceUpdateComponent.prototype.selectValues = function () {
        var _this = this;
        var selectValues = [];
        selectValues.push({ value: undefined, label: 'Choose access type...', isSelected: this.idService.oidcAccessType == null });
        var allOidcTypes = ServiceViewModel_1.ServiceViewModel.getAllOidcAccessTypes();
        allOidcTypes.forEach(function (oidcType) {
            var isSelected = OidcAccessTypeEnum[oidcType.value] === OidcAccessTypeEnum[_this.idService.oidcAccessType];
            selectValues.push({ value: oidcType.value, label: oidcType.label, isSelected: isSelected });
        });
        return selectValues;
    };
    ServiceUpdateComponent.prototype.vesselSelectValues = function () {
        var _this = this;
        var selectValues = [];
        var defaultSelected = true;
        if (this.vessels && this.vessels.length > 0) {
            this.vessels.forEach(function (vessel) {
                var isSelected = false;
                if (_this.vessel) {
                    isSelected = _this.vessel.mrn === vessel.mrn;
                }
                else {
                    isSelected = defaultSelected;
                    defaultSelected = false;
                }
                selectValues.push({ value: vessel, label: vessel_helper_1.VesselHelper.labelForSelect(vessel), isSelected: isSelected });
            });
        }
        return selectValues;
    };
    ServiceUpdateComponent = __decorate([
        core_1.Component({
            selector: 'service-update',
            encapsulation: core_1.ViewEncapsulation.None,
            template: __webpack_require__("./src/app/pages/org-identity-registry/services/components/service-update/service-update.html"),
            styles: []
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof forms_1.FormBuilder !== 'undefined' && forms_1.FormBuilder) === 'function' && _a) || Object, (typeof (_b = typeof router_1.ActivatedRoute !== 'undefined' && router_1.ActivatedRoute) === 'function' && _b) || Object, (typeof (_c = typeof navigation_helper_service_1.NavigationHelperService !== 'undefined' && navigation_helper_service_1.NavigationHelperService) === 'function' && _c) || Object, (typeof (_d = typeof mc_notifications_service_1.MCNotificationsService !== 'undefined' && mc_notifications_service_1.MCNotificationsService) === 'function' && _d) || Object, (typeof (_e = typeof id_services_service_1.IdServicesService !== 'undefined' && id_services_service_1.IdServicesService) === 'function' && _e) || Object, (typeof (_f = typeof mrn_helper_service_1.MrnHelperService !== 'undefined' && mrn_helper_service_1.MrnHelperService) === 'function' && _f) || Object, (typeof (_g = typeof vessels_service_1.VesselsService !== 'undefined' && vessels_service_1.VesselsService) === 'function' && _g) || Object])
    ], ServiceUpdateComponent);
    return ServiceUpdateComponent;
    var _a, _b, _c, _d, _e, _f, _g;
}());
exports.ServiceUpdateComponent = ServiceUpdateComponent;


/***/ },

/***/ "./src/app/pages/org-identity-registry/services/components/service-update/service-update.html":
/***/ function(module, exports) {

module.exports = "<div class=\"row\">\n  <div class=\"col-lg-12\">\n    <ba-card title=\"Update - {{idService?.name}}\" baCardClass=\"with-scroll table-panel\">\n      <mc-form [formNeedsUpdating]=\"true\" [formGroup]=\"updateForm\" [formControlModels]=\"formControlModels\" [isLoading]=\"isLoading\" [isRegistering]=\"isUpdating\" [registerTitle]=\"updateTitle\" (onCancel)=\"cancel()\" (onRegister)=\"update()\"></mc-form>\n    </ba-card>\n  </div>\n</div>\n<mc-modal (onCancel)=\"cancelModal()\" (onOk)=\"showVesselAttWarning()\" [show]=\"showModal\" [title]=\"'Update service'\" [description]=\"modalDescription\" [cancelClass]=\"'btn btn-default btn-raised'\" [cancelTitle]=\"'Cancel'\" [okClass]=\"'btn btn-danger btn-raised'\" [okTitle]=\"'Update'\"></mc-modal>\n<mc-modal (onCancel)=\"cancelModal()\" (onOk)=\"updateForSure()\" [show]=\"showModalVesselAtt\" [title]=\"'Update service'\" [description]=\"modalDescription\" [cancelClass]=\"'btn btn-default btn-raised'\" [cancelTitle]=\"'Cancel'\" [okClass]=\"'btn btn-danger btn-raised'\" [okTitle]=\"'Update'\"></mc-modal>\n"

/***/ },

/***/ "./src/app/pages/org-identity-registry/services/services.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var ServicesComponent = (function () {
    function ServicesComponent() {
    }
    ServicesComponent = __decorate([
        core_1.Component({
            selector: 'services',
            template: "<router-outlet></router-outlet>"
        }), 
        __metadata('design:paramtypes', [])
    ], ServicesComponent);
    return ServicesComponent;
}());
exports.ServicesComponent = ServicesComponent;


/***/ },

/***/ "./src/app/pages/org-identity-registry/services/services.module.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var common_1 = __webpack_require__("./node_modules/@angular/common/index.js");
var services_routing_1 = __webpack_require__("./src/app/pages/org-identity-registry/services/services.routing.ts");
var services_component_1 = __webpack_require__("./src/app/pages/org-identity-registry/services/services.component.ts");
var service_list_component_1 = __webpack_require__("./src/app/pages/org-identity-registry/services/components/service-list/service-list.component.ts");
var service_details_component_1 = __webpack_require__("./src/app/pages/org-identity-registry/services/components/service-details/service-details.component.ts");
var nga_module_1 = __webpack_require__("./src/app/theme/nga.module.ts");
var shared_module_1 = __webpack_require__("./src/app/pages/shared/shared.module.ts");
var service_new_component_1 = __webpack_require__("./src/app/pages/org-identity-registry/services/components/service-new/service-new.component.ts");
var service_update_component_1 = __webpack_require__("./src/app/pages/org-identity-registry/services/components/service-update/service-update.component.ts");
var ServicesModule = (function () {
    function ServicesModule() {
    }
    ServicesModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                nga_module_1.NgaModule,
                shared_module_1.SharedModule,
                services_routing_1.routing
            ],
            declarations: [
                services_component_1.ServicesComponent,
                service_details_component_1.ServiceDetailsComponent,
                service_list_component_1.ServiceListComponent,
                service_new_component_1.ServiceNewComponent,
                service_update_component_1.ServiceUpdateComponent
            ],
            exports: [
                service_new_component_1.ServiceNewComponent,
                service_update_component_1.ServiceUpdateComponent
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], ServicesModule);
    return ServicesModule;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ServicesModule;


/***/ },

/***/ "./src/app/pages/org-identity-registry/services/services.routing.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var services_component_1 = __webpack_require__("./src/app/pages/org-identity-registry/services/services.component.ts");
var service_list_component_1 = __webpack_require__("./src/app/pages/org-identity-registry/services/components/service-list/service-list.component.ts");
var service_details_component_1 = __webpack_require__("./src/app/pages/org-identity-registry/services/components/service-details/service-details.component.ts");
var service_new_component_1 = __webpack_require__("./src/app/pages/org-identity-registry/services/components/service-new/service-new.component.ts");
var certificate_issue_new_component_1 = __webpack_require__("./src/app/pages/shared/components/certificate-issue-new/certificate-issue-new.component.ts");
var service_update_component_1 = __webpack_require__("./src/app/pages/org-identity-registry/services/components/service-update/service-update.component.ts");
var certificate_revoke_component_1 = __webpack_require__("./src/app/pages/shared/components/certificate-revoke/certificate-revoke.component.ts");
// noinspection TypeScriptValidateTypes
var routes = [
    {
        path: 'services',
        component: services_component_1.ServicesComponent,
        data: { breadcrumb: 'Services' },
        children: [
            {
                path: '',
                component: service_list_component_1.ServiceListComponent
            },
            {
                path: 'issuecert',
                component: certificate_issue_new_component_1.CertificateIssueNewComponent,
                data: { breadcrumb: 'New Certificate' },
                children: []
            },
            {
                path: 'revokecert',
                component: certificate_revoke_component_1.CertificateRevokeComponent,
                data: { breadcrumb: 'Revoke Certificate' },
                children: []
            },
            {
                path: 'register',
                component: service_new_component_1.ServiceNewComponent,
                data: { breadcrumb: 'Register' }
            },
            {
                path: ':id',
                component: service_details_component_1.ServiceDetailsComponent,
                data: { breadcrumb: 'Details' }
            },
            {
                path: 'update/:id',
                component: service_update_component_1.ServiceUpdateComponent,
                data: { breadcrumb: 'Update' }
            }
        ]
    }
];
exports.routing = router_1.RouterModule.forChild(routes);


/***/ },

/***/ "./src/app/pages/org-identity-registry/services/view-models/ServiceViewModel.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var enums_helper_1 = __webpack_require__("./src/app/shared/enums-helper.ts");
var Service_1 = __webpack_require__("./src/app/backend-api/identity-registry/autogen/model/Service.ts");
var OidcAccessTypeEnum = Service_1.Service.OidcAccessTypeEnum;
var ServiceViewModel = (function () {
    function ServiceViewModel() {
    }
    ServiceViewModel.getAllOidcAccessTypes = function () {
        var models = [];
        var keysAndValues = enums_helper_1.EnumsHelper.getKeysAndValuesFromEnum(OidcAccessTypeEnum);
        keysAndValues.forEach(function (enumKeyAndValue) {
            var model = {};
            model.value = enumKeyAndValue.value;
            model.label = ServiceViewModel.getLabelForEnum(enumKeyAndValue.value);
            models.push(model);
        });
        return models;
    };
    ServiceViewModel.getLabelForEnum = function (oidcAccessTypeEnum) {
        if (!oidcAccessTypeEnum) {
            return '';
        }
        var text = '';
        switch (oidcAccessTypeEnum) {
            case OidcAccessTypeEnum.BearerOnly: {
                text = 'Bearer only';
                break;
            }
            case OidcAccessTypeEnum.Confidential: {
                text = 'Confidential';
                break;
            }
            case OidcAccessTypeEnum.Public: {
                text = 'Public';
                break;
            }
            default: {
                text = OidcAccessTypeEnum[oidcAccessTypeEnum];
                if (!text) {
                    text = '' + oidcAccessTypeEnum;
                }
            }
        }
        return text;
    };
    return ServiceViewModel;
}());
exports.ServiceViewModel = ServiceViewModel;


/***/ },

/***/ "./src/app/pages/org-service-registry/designs/components/design-details/design-details.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var mc_notifications_service_1 = __webpack_require__("./src/app/shared/mc-notifications.service.ts");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var file_helper_service_1 = __webpack_require__("./src/app/shared/file-helper.service.ts");
var designs_service_1 = __webpack_require__("./src/app/backend-api/service-registry/services/designs.service.ts");
var navigation_helper_service_1 = __webpack_require__("./src/app/shared/navigation-helper.service.ts");
var specifications_service_1 = __webpack_require__("./src/app/backend-api/service-registry/services/specifications.service.ts");
var instances_service_1 = __webpack_require__("./src/app/backend-api/service-registry/services/instances.service.ts");
var auth_service_1 = __webpack_require__("./src/app/authentication/services/auth.service.ts");
var sr_view_model_service_1 = __webpack_require__("./src/app/pages/org-service-registry/shared/services/sr-view-model.service.ts");
var organizations_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/organizations.service.ts");
var sr_search_requests_service_1 = __webpack_require__("./src/app/pages/org-service-registry/shared/services/sr-search-requests.service.ts");
var endorsements_service_1 = __webpack_require__("./src/app/backend-api/endorsements/services/endorsements.service.ts");
var app_constants_1 = __webpack_require__("./src/app/shared/app.constants.ts");
var Observable_1 = __webpack_require__("./node_modules/rxjs/Observable.js");
var SEARCH_KEY = 'DesignDetailsComponent';
var DesignDetailsComponent = (function () {
    function DesignDetailsComponent(searchRequestsService, endorsementsService, authService, route, router, viewModelService, navigationHelperService, instancesService, specificationsService, notifications, designsService, fileHelperService, orgsService) {
        this.searchRequestsService = searchRequestsService;
        this.endorsementsService = endorsementsService;
        this.authService = authService;
        this.route = route;
        this.router = router;
        this.viewModelService = viewModelService;
        this.navigationHelperService = navigationHelperService;
        this.instancesService = instancesService;
        this.specificationsService = specificationsService;
        this.notifications = notifications;
        this.designsService = designsService;
        this.fileHelperService = fileHelperService;
        this.orgsService = orgsService;
        this.showModal = false;
        this.showModalNoDelete = false;
        this.endorsements = [];
        this.endorseMainSwitch = app_constants_1.SHOW_ENDORSEMENTS;
        // Search
        this.isSearchingInstances = false;
        this.searchKey = SEARCH_KEY;
    }
    DesignDetailsComponent.prototype.ngOnInit = function () {
        this.onCreate = this.createInstance.bind(this);
        this.onGotoSpec = this.gotoSpecification.bind(this);
        this.onGotoInstance = this.gotoInstance.bind(this);
        this.isLoadingDesign = true;
        this.isLoadingInstances = true;
        this.title = 'Loading ...';
        var designId = this.route.snapshot.params['id'];
        var version = this.route.snapshot.queryParams['designVersion'];
        this.loadDesign(designId, version);
        if (app_constants_1.SHOW_ENDORSEMENTS) {
            this.loadEndorsements(designId, version);
        }
    };
    DesignDetailsComponent.prototype.downloadXml = function () {
        this.fileHelperService.downloadXml(this.design.designAsXml);
    };
    DesignDetailsComponent.prototype.downloadDoc = function () {
        this.fileHelperService.downloadDoc(this.design.designAsDoc);
    };
    DesignDetailsComponent.prototype.loadDesign = function (designId, version) {
        var _this = this;
        this.designsService.getDesign(designId, version).subscribe(function (design) {
            _this.title = design.name;
            _this.design = design;
            _this.loadOrganizationName();
            _this.loadInstances();
        }, function (err) {
            // TODO: make this as a general component
            if (err.status == 404) {
                _this.router.navigate(['/error404'], { relativeTo: _this.route, replaceUrl: true });
            }
            _this.title = 'Error while loading';
            _this.isLoadingDesign = false;
            _this.isLoadingInstances = false;
            _this.notifications.generateNotification('Error', 'Error when trying to get design', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    DesignDetailsComponent.prototype.loadOrganizationName = function () {
        var _this = this;
        this.orgsService.getOrganizationName(this.design.organizationId).subscribe(function (organizationName) {
            _this.labelValues = _this.viewModelService.generateLabelValuesForDesign(_this.design, organizationName);
            _this.generateLabelValuesForSpecification();
            _this.isLoadingDesign = false;
        }, function (err) {
            _this.labelValues = _this.viewModelService.generateLabelValuesForSpecification(_this.design, '');
            _this.generateLabelValuesForSpecification();
            _this.isLoadingDesign = false;
            _this.notifications.generateNotification('Error', 'Error when trying to get organization', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    DesignDetailsComponent.prototype.loadInstances = function () {
        var searchRequest = this.searchRequestsService.getSearchRequest(SEARCH_KEY);
        this.initialSearchRequest = searchRequest;
        this.searchDesigns(searchRequest);
    };
    DesignDetailsComponent.prototype.generateLabelValuesForSpecification = function () {
        var _this = this;
        if (this.design.specifications && this.design.specifications.length > 0) {
            var plur = (this.design.specifications.length > 1 ? 's' : '');
            var label = 'Implemented specification' + plur;
            this.design.specifications.forEach(function (specification) {
                _this.labelValues.push({ label: label, valueHtml: specification.name + " - " + specification.version, linkFunction: _this.onGotoSpec, linkValue: [specification.specificationId, specification.version] });
                label = "";
            });
        }
    };
    DesignDetailsComponent.prototype.createInstance = function () {
        this.navigationHelperService.navigateToCreateInstance(this.design.designId, this.design.version);
    };
    DesignDetailsComponent.prototype.gotoSpecification = function (linkValue) {
        try {
            this.navigationHelperService.navigateToOrgSpecification(linkValue[0], linkValue[1]);
        }
        catch (error) {
            this.notifications.generateNotification('Error', 'Error when trying to go to specification', mc_notifications_service_1.MCNotificationType.Error, error);
        }
    };
    DesignDetailsComponent.prototype.gotoInstance = function (index) {
        this.navigationHelperService.navigateToOrgInstance(this.instances[index].instanceId, this.instances[index].version);
    };
    DesignDetailsComponent.prototype.isMyOrg = function () {
        return this.design.organizationId === this.authService.authState.orgMrn;
    };
    DesignDetailsComponent.prototype.shouldDisplayDelete = function () {
        return this.isServiceAdminForOrg() && !this.isLoadingInstances;
    };
    DesignDetailsComponent.prototype.hasInstances = function () {
        return this.instances && this.instances.length > 0;
    };
    DesignDetailsComponent.prototype.delete = function () {
        if (this.hasInstances()) {
            this.modalDescriptionNoDelete = "Design can't be deleted with active Instances.<br><br>You must first delete the Instances.";
            this.showModalNoDelete = true;
        }
        else {
            this.modalDescription = 'Do you want to delete the design?';
            this.showModal = true;
        }
    };
    DesignDetailsComponent.prototype.cancelModal = function () {
        this.showModal = false;
        this.showModalNoDelete = false;
    };
    DesignDetailsComponent.prototype.deleteForSure = function () {
        var _this = this;
        this.isLoadingDesign = true;
        this.showModal = false;
        this.designsService.deleteDesign(this.design).subscribe(function () {
            _this.deleteEndorsements();
        }, function (err) {
            _this.isLoadingDesign = false;
            _this.notifications.generateNotification('Error', 'Error when trying to delete design', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    DesignDetailsComponent.prototype.isEndorseAdmin = function () {
        return this.authService.authState.hasPermission(auth_service_1.AuthPermission.OrgAdmin);
    };
    DesignDetailsComponent.prototype.isServiceAdmin = function () {
        return this.authService.authState.hasPermission(auth_service_1.AuthPermission.ServiceAdmin);
    };
    DesignDetailsComponent.prototype.isServiceAdminForOrg = function () {
        return (this.authService.authState.hasPermission(auth_service_1.AuthPermission.ServiceAdmin) && this.isMyOrg()) || this.authService.authState.hasPermission(auth_service_1.AuthPermission.SiteAdmin);
    };
    DesignDetailsComponent.prototype.showUpdate = function () {
        return this.isServiceAdminForOrg();
    };
    DesignDetailsComponent.prototype.update = function () {
        this.navigationHelperService.navigateToUpdateDesign(this.design.designId, this.design.version);
    };
    // Endorsements
    DesignDetailsComponent.prototype.deleteEndorsements = function () {
        var _this = this;
        if (this.endorsements && this.endorsements.length > 0) {
            this.endorsementsService.removeAllEndorsementsOfDesign(this.design.designId).subscribe(function () {
                _this.navigationHelperService.navigateToOrgDesign('', '');
            }, function (err) {
                _this.notifications.generateNotification('Error', 'Error when trying to delete endorsements of design', mc_notifications_service_1.MCNotificationType.Error, err);
                _this.navigationHelperService.navigateToOrgDesign('', '');
            });
        }
        else {
            this.navigationHelperService.navigateToOrgDesign('', '');
        }
    };
    DesignDetailsComponent.prototype.loadEndorsements = function (designId, designVersion) {
        var _this = this;
        this.isLoadingEndorsements = true;
        var parallelObservables = [];
        parallelObservables.push(this.endorsementsService.isDesignEndorsedByMyOrg(designId, designVersion).take(1));
        parallelObservables.push(this.endorsementsService.getEndorsementsForDesign(designId, designVersion).take(1));
        return Observable_1.Observable.forkJoin(parallelObservables).subscribe(function (resultArray) {
            var isEndorsedByMyOrg = resultArray[0];
            var pageEndorsement = resultArray[1];
            _this.endorsements = pageEndorsement.content;
            _this.isEndorsedByMyOrg = isEndorsedByMyOrg;
            _this.isLoadingEndorsements = false;
            _this.showEndorsements = true;
        }, function (err) {
            _this.showEndorsements = false;
            _this.isLoadingEndorsements = false;
            _this.notifications.generateNotification('Error', 'Error when trying to get endorsements for design', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    DesignDetailsComponent.prototype.endorseToggle = function () {
        if (this.isEndorsedByMyOrg) {
            this.removeEndorse();
        }
        else {
            this.endorse();
        }
    };
    DesignDetailsComponent.prototype.endorse = function () {
        var _this = this;
        this.isEndorsing = true;
        var specificationId = '';
        var specificationVersion = '';
        if (this.design.specifications && this.design.specifications.length > 0) {
            // TODO handle more specifications when endorse api has the functionality
            specificationId = this.design.specifications[0].specificationId;
            specificationVersion = this.design.specifications[0].version;
        }
        this.endorsementsService.endorseDesign(this.design.designId, this.design.version, specificationId, specificationVersion).subscribe(function (_) {
            _this.isEndorsedByMyOrg = true;
            _this.isEndorsing = false;
            _this.loadEndorsements(_this.design.designId, _this.design.version);
        }, function (err) {
            _this.isEndorsing = false;
            _this.notifications.generateNotification('Error', 'Error when trying to endorse design', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    DesignDetailsComponent.prototype.removeEndorse = function () {
        var _this = this;
        this.isEndorsing = true;
        this.endorsementsService.removeEndorsementOfDesign(this.design.designId, this.design.version).subscribe(function (_) {
            _this.isEndorsedByMyOrg = false;
            _this.isEndorsing = false;
            _this.loadEndorsements(_this.design.designId, _this.design.version);
        }, function (err) {
            _this.isEndorsing = false;
            _this.notifications.generateNotification('Error', 'Error when trying to remove endorse of design', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    DesignDetailsComponent.prototype.shouldDisplayEndorsementButton = function () {
        return app_constants_1.SHOW_ENDORSEMENTS && this.isEndorseAdmin() && this.showEndorsements;
    };
    // Search
    DesignDetailsComponent.prototype.search = function (searchRequest) {
        this.isSearchingInstances = true;
        this.searchDesigns(searchRequest);
    };
    DesignDetailsComponent.prototype.searchDesigns = function (searchRequest) {
        var _this = this;
        this.instancesService.searchInstancesForDesign(searchRequest, this.design.designId, this.design.version).subscribe(function (instances) {
            _this.instances = instances;
            _this.isLoadingInstances = false;
            _this.isSearchingInstances = false;
            _this.initialSearchRequest = searchRequest;
        }, function (err) {
            _this.searchRequestsService.addSearchRequest(SEARCH_KEY, _this.initialSearchRequest);
            _this.isLoadingInstances = false;
            _this.isSearchingInstances = false;
            _this.notifications.generateNotification('Error', 'Error when trying to search instances', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    DesignDetailsComponent = __decorate([
        core_1.Component({
            selector: 'design-details',
            encapsulation: core_1.ViewEncapsulation.None,
            template: __webpack_require__("./src/app/pages/org-service-registry/designs/components/design-details/design-details.html"),
            styles: []
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof sr_search_requests_service_1.SrSearchRequestsService !== 'undefined' && sr_search_requests_service_1.SrSearchRequestsService) === 'function' && _a) || Object, (typeof (_b = typeof endorsements_service_1.EndorsementsService !== 'undefined' && endorsements_service_1.EndorsementsService) === 'function' && _b) || Object, (typeof (_c = typeof auth_service_1.AuthService !== 'undefined' && auth_service_1.AuthService) === 'function' && _c) || Object, (typeof (_d = typeof router_1.ActivatedRoute !== 'undefined' && router_1.ActivatedRoute) === 'function' && _d) || Object, (typeof (_e = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _e) || Object, (typeof (_f = typeof sr_view_model_service_1.SrViewModelService !== 'undefined' && sr_view_model_service_1.SrViewModelService) === 'function' && _f) || Object, (typeof (_g = typeof navigation_helper_service_1.NavigationHelperService !== 'undefined' && navigation_helper_service_1.NavigationHelperService) === 'function' && _g) || Object, (typeof (_h = typeof instances_service_1.InstancesService !== 'undefined' && instances_service_1.InstancesService) === 'function' && _h) || Object, (typeof (_j = typeof specifications_service_1.SpecificationsService !== 'undefined' && specifications_service_1.SpecificationsService) === 'function' && _j) || Object, (typeof (_k = typeof mc_notifications_service_1.MCNotificationsService !== 'undefined' && mc_notifications_service_1.MCNotificationsService) === 'function' && _k) || Object, (typeof (_l = typeof designs_service_1.DesignsService !== 'undefined' && designs_service_1.DesignsService) === 'function' && _l) || Object, (typeof (_m = typeof file_helper_service_1.FileHelperService !== 'undefined' && file_helper_service_1.FileHelperService) === 'function' && _m) || Object, (typeof (_o = typeof organizations_service_1.OrganizationsService !== 'undefined' && organizations_service_1.OrganizationsService) === 'function' && _o) || Object])
    ], DesignDetailsComponent);
    return DesignDetailsComponent;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
}());
exports.DesignDetailsComponent = DesignDetailsComponent;


/***/ },

/***/ "./src/app/pages/org-service-registry/designs/components/design-details/design-details.html":
/***/ function(module, exports) {

module.exports = "<div class=\"row\">\n  <div class=\"col-lg-12\">\n    <ba-card title=\"{{title}}\" baCardClass=\"with-scroll table-panel\">\n      <mc-label-value-table [isLoading]=\"isLoadingDesign\" [labelValues]=\"labelValues\"></mc-label-value-table>\n      <ul *ngIf=\"design && !isLoadingDesign\" class=\"btn-list clearfix\">\n        <li *ngIf=\"design.designAsDoc\">\n          <button type=\"button\" class=\"btn btn-primary btn-raised\" (click)=\"downloadDoc()\">Download document</button>\n        </li>\n        <li *ngIf=\"design.designAsXml\">\n          <button type=\"button\" class=\"btn btn-primary btn-raised\" (click)=\"downloadXml()\">Download XML</button>\n        </li>\n        <li *ngIf=\"showUpdate()\">\n          <button type=\"button\" class=\"btn btn-primary btn-raised\" (click)=\"update()\">Update Design</button>\n        </li>\n        <li *ngIf=\"shouldDisplayDelete()\">\n          <button type=\"button\" class=\"btn btn-danger btn-raised\" (click)=\"delete()\">Delete Design</button>\n        </li>\n        <li *ngIf=\"shouldDisplayEndorsementButton() && !isLoadingInstances\">\n          <mc-endorse-button [isEndorsedByMyOrg]=\"isEndorsedByMyOrg\" [isEndorsing]=\"isEndorsing\"[title]=\"'Design'\" (onEndorse)=\"endorseToggle()\"></mc-endorse-button>\n        </li>\n      </ul>\n    </ba-card>\n\n    <div *ngIf=\"endorseMainSwitch\">\n      <endorsed-by-list [title]=\"'Organizations endorsing the Design (' + title + ')'\" [endorsements]=\"endorsements\" [isLoading]=\"isLoadingEndorsements\"></endorsed-by-list>\n    </div>\n\n    <ba-card title=\"Instances implementing the Design ({{design?.name}})\" baCardClass=\"with-scroll table-panel\">\n      <div *ngIf=\"!isLoadingInstances\">\n        <service-registry-search [showKeywords]=\"false\" [searchTitle]=\"'Instance search filters'\" [searchKey]=\"searchKey\" [isSearching]=\"isSearchingInstances\" [showEndorsement]=\"true\" [preFilterMyOrg]=\"false\" (onSearch)=\"search($event)\"></service-registry-search>\n\n        <div class=\"separator\"></div>\n      </div>\n      <div class=\"create-loading-wrapper\">\n        <mc-create-button [isAdmin]=\"isServiceAdmin()\" *ngIf=\"!isLoadingInstances\" title=\"Register new Instance\" [onClick]=\"onCreate\" ></mc-create-button>\n        <sk-fading-circle-small class=\"create-loading\" [isRunning]=\"isSearchingInstances\"></sk-fading-circle-small>\n      </div>\n      <instances-table [instances]=\"instances\" [isLoading]=\"isLoadingInstances\" [onRowClick]=\"onGotoInstance\"></instances-table>\n    </ba-card>\n  </div>\n</div>\n<mc-modal (onCancel)=\"cancelModal()\" (onOk)=\"deleteForSure()\" [show]=\"showModal\" [title]=\"'Delete Design'\" [description]=\"modalDescription\" [cancelClass]=\"'btn btn-default btn-raised'\" [cancelTitle]=\"'Cancel'\" [okClass]=\"'btn btn-danger btn-raised'\" [okTitle]=\"'Delete'\"></mc-modal>\n<mc-modal (onOk)=\"cancelModal()\" [show]=\"showModalNoDelete\" [title]=\"'Delete Design'\" [description]=\"modalDescriptionNoDelete\" [okClass]=\"'btn btn-default btn-raised'\" [okTitle]=\"'OK'\"></mc-modal>\n"

/***/ },

/***/ "./src/app/pages/org-service-registry/designs/components/design-list/design-list.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var organizations_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/organizations.service.ts");
var mc_notifications_service_1 = __webpack_require__("./src/app/shared/mc-notifications.service.ts");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var designs_service_1 = __webpack_require__("./src/app/backend-api/service-registry/services/designs.service.ts");
var sr_search_requests_service_1 = __webpack_require__("./src/app/pages/org-service-registry/shared/services/sr-search-requests.service.ts");
var SEARCH_KEY = 'DesignListComponent';
var DesignListComponent = (function () {
    function DesignListComponent(searchRequestsService, route, router, notifications, orgService, designsService) {
        this.searchRequestsService = searchRequestsService;
        this.route = route;
        this.router = router;
        this.notifications = notifications;
        this.orgService = orgService;
        this.designsService = designsService;
        this.searchKey = SEARCH_KEY;
        this.isSearching = false;
    }
    DesignListComponent.prototype.ngOnInit = function () {
        this.cardTitle = 'Technical Designs';
        this.onGotoDesign = this.gotoDesign.bind(this);
        this.isLoading = true;
        this.loadMyOrganization();
        this.loadDesigns();
    };
    DesignListComponent.prototype.search = function (searchRequest) {
        this.isSearching = true;
        this.searchDesigns(searchRequest);
    };
    DesignListComponent.prototype.searchDesigns = function (searchRequest) {
        var _this = this;
        this.designsService.searchDesigns(searchRequest).subscribe(function (designs) {
            _this.designs = designs;
            _this.isSearching = false;
            _this.isLoading = false;
            _this.initialSearchRequest = searchRequest;
        }, function (err) {
            _this.searchRequestsService.addSearchRequest(SEARCH_KEY, _this.initialSearchRequest);
            _this.isSearching = false;
            _this.isLoading = false;
            _this.notifications.generateNotification('Error', 'Error when trying to search designs', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    DesignListComponent.prototype.loadDesigns = function () {
        var _this = this;
        var searchRequest = this.searchRequestsService.getSearchRequest(SEARCH_KEY);
        this.initialSearchRequest = searchRequest;
        if (searchRequest) {
            this.searchDesigns(searchRequest);
        }
        else {
            this.designsService.getDesignsForMyOrg().subscribe(function (designs) {
                _this.designs = designs;
                _this.isLoading = false;
            }, function (err) {
                _this.isLoading = false;
                _this.notifications.generateNotification('Error', 'Error when trying to get designs', mc_notifications_service_1.MCNotificationType.Error, err);
            });
        }
    };
    DesignListComponent.prototype.loadMyOrganization = function () {
        var _this = this;
        this.orgService.getMyOrganization().subscribe(function (organization) {
            _this.organization = organization;
        }, function (err) {
            _this.notifications.generateNotification('Error', 'Error when trying to get organization', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    DesignListComponent.prototype.gotoDesign = function (index) {
        this.router.navigate([this.designs[index].designId], { queryParams: { designVersion: this.designs[index].version }, relativeTo: this.route });
    };
    DesignListComponent = __decorate([
        core_1.Component({
            selector: 'design-list',
            encapsulation: core_1.ViewEncapsulation.None,
            template: __webpack_require__("./src/app/pages/org-service-registry/designs/components/design-list/design-list.html"),
            styles: []
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof sr_search_requests_service_1.SrSearchRequestsService !== 'undefined' && sr_search_requests_service_1.SrSearchRequestsService) === 'function' && _a) || Object, (typeof (_b = typeof router_1.ActivatedRoute !== 'undefined' && router_1.ActivatedRoute) === 'function' && _b) || Object, (typeof (_c = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _c) || Object, (typeof (_d = typeof mc_notifications_service_1.MCNotificationsService !== 'undefined' && mc_notifications_service_1.MCNotificationsService) === 'function' && _d) || Object, (typeof (_e = typeof organizations_service_1.OrganizationsService !== 'undefined' && organizations_service_1.OrganizationsService) === 'function' && _e) || Object, (typeof (_f = typeof designs_service_1.DesignsService !== 'undefined' && designs_service_1.DesignsService) === 'function' && _f) || Object])
    ], DesignListComponent);
    return DesignListComponent;
    var _a, _b, _c, _d, _e, _f;
}());
exports.DesignListComponent = DesignListComponent;


/***/ },

/***/ "./src/app/pages/org-service-registry/designs/components/design-list/design-list.html":
/***/ function(module, exports) {

module.exports = "<div class=\"row\">\n  <div class=\"col-lg-12\">\n    <ba-card title=\"{{cardTitle}}\" baCardClass=\"with-scroll table-panel\">\n      <service-registry-search [searchTitle]=\"'Search filters'\" [searchKey]=\"searchKey\" [isSearching]=\"isSearching\" [showEndorsement]=\"true\" [preFilterMyOrg]=\"true\" (onSearch)=\"search($event)\"></service-registry-search>\n\n      <div class=\"separator\"></div>\n\n      <designs-table [designs]=\"designs\" [isLoading]=\"isLoading\" [onRowClick]=\"onGotoDesign\"></designs-table>\n    </ba-card>\n  </div>\n</div>\n"

/***/ },

/***/ "./src/app/pages/org-service-registry/designs/components/design-new/design-new.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var mc_notifications_service_1 = __webpack_require__("./src/app/shared/mc-notifications.service.ts");
var organizations_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/organizations.service.ts");
var mcFileUploader_component_1 = __webpack_require__("./src/app/theme/components/mcFileUploader/mcFileUploader.component.ts");
var navigation_helper_service_1 = __webpack_require__("./src/app/shared/navigation-helper.service.ts");
var xml_parser_service_1 = __webpack_require__("./src/app/shared/xml-parser.service.ts");
var designs_service_1 = __webpack_require__("./src/app/backend-api/service-registry/services/designs.service.ts");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var specifications_service_1 = __webpack_require__("./src/app/backend-api/service-registry/services/specifications.service.ts");
var sr_view_model_service_1 = __webpack_require__("./src/app/pages/org-service-registry/shared/services/sr-view-model.service.ts");
var mrn_helper_service_1 = __webpack_require__("./src/app/shared/mrn-helper.service.ts");
var design_xml_parser_service_1 = __webpack_require__("./src/app/pages/org-service-registry/shared/services/design-xml-parser.service.ts");
var DesignNewComponent = (function () {
    function DesignNewComponent(xmlParser, mrnHelper, activatedRoute, xmlParserService, viewModelService, navigationService, notifications, designsService, orgService, specificationsService) {
        this.xmlParser = xmlParser;
        this.mrnHelper = mrnHelper;
        this.activatedRoute = activatedRoute;
        this.xmlParserService = xmlParserService;
        this.viewModelService = viewModelService;
        this.navigationService = navigationService;
        this.notifications = notifications;
        this.designsService = designsService;
        this.orgService = orgService;
        this.specificationsService = specificationsService;
        this.hasError = false;
        this.captionXml = 'Upload Design XML file';
        this.captionDoc = 'Upload Design Document file';
        this.fileTypeXml = mcFileUploader_component_1.FileUploadType.Xml;
        this.fileTypeDoc = mcFileUploader_component_1.FileUploadType.Doc;
        this.requiredTextXml = 'You need to upload XML file';
        this.requiredTextDoc = 'You need to upload a DOCX, ODT or PDF file';
        this.isFormValid = false;
        this.isLoading = true;
        this.isRegistering = false;
        this.registerTitle = "Register Design";
        this.registerButtonClass = "btn btn-danger btn-raised";
    }
    DesignNewComponent.prototype.ngOnInit = function () {
        this.onRegister = this.register.bind(this);
        this.isRegistering = false;
        this.isLoading = true;
        this.loadMyOrganization();
        this.loadSpecification();
        this.updateUI();
    };
    DesignNewComponent.prototype.calculateFormValid = function () {
        this.isFormValid = this.xml != null;
    };
    DesignNewComponent.prototype.onUploadDoc = function (file) {
        this.doc = file;
        this.calculateFormValid();
    };
    DesignNewComponent.prototype.onUploadXml = function (file) {
        if (file && this.isXmlValid(file)) {
            this.xml = file;
        }
        else {
            this.resetXmlFile();
        }
        this.calculateFormValid();
        this.updateUI();
    };
    DesignNewComponent.prototype.isXmlValid = function (file) {
        try {
            var mrn = this.xmlParser.getMrn(file);
            var isValid = this.mrnHelper.checkMrnForDesign(mrn);
            if (!isValid) {
                this.errorText = "The ID in the XML-file is wrong. The ID is supposed to be an MRN in the following format:<BR>"
                    + this.mrnHelper.mrnMaskForDesign() + "'ID'<BR>"
                    + "'ID'=" + this.mrnHelper.mrnPatternError();
            }
            else {
                var specificationMrn = this.xmlParser.getMrnForSpecificationInDesign(file);
                var specificationVersion = this.xmlParser.getVersionForSpecificationInDesign(file);
                isValid = (specificationMrn === this.specification.specificationId) && (specificationVersion === this.specification.version);
                if (!isValid) {
                    this.errorText = "The MRN and/or version referencing the Specification in the XML, doesn't match the MRN and/or version of the chosen Specification.<BR><BR>"
                        + "Chosen Specification: " + this.specification.specificationId + ", version: " + this.specification.version + "<BR>"
                        + "Xml-parsed Specification: " + specificationMrn + ", version: " + specificationVersion + "<BR>";
                }
            }
            this.hasError = !isValid;
            return isValid;
        }
        catch (error) {
            this.notifications.generateNotification('Error in XML', error.message, mc_notifications_service_1.MCNotificationType.Error, error);
            return false;
        }
    };
    DesignNewComponent.prototype.cancel = function () {
        this.navigationService.cancelCreateDesign();
    };
    DesignNewComponent.prototype.register = function () {
        this.isRegistering = true;
        this.createDesign(this.parsedDesign);
    };
    DesignNewComponent.prototype.createDesign = function (design) {
        var _this = this;
        this.designsService.createDesign(design).subscribe(function (design) {
            _this.navigationService.navigateToOrgDesign(design.designId, design.version);
            _this.isRegistering = false;
        }, function (err) {
            _this.isRegistering = false;
            _this.notifications.generateNotification('Error', 'Error when trying to create design', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    DesignNewComponent.prototype.loadMyOrganization = function () {
        var _this = this;
        this.orgService.getMyOrganization().subscribe(function (organization) {
            _this.organization = organization;
            _this.calculateFormValid();
        }, function (err) {
            _this.notifications.generateNotification('Error', 'Error when trying to get organization', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    DesignNewComponent.prototype.loadSpecification = function () {
        var _this = this;
        var specificationId = this.activatedRoute.snapshot.queryParams['specificationId'];
        var version = this.activatedRoute.snapshot.queryParams['specificationVersion'];
        this.specificationsService.getSpecification(specificationId, version).subscribe(function (specification) {
            _this.specification = specification;
            _this.loadOrganizationName();
        }, function (err) {
            _this.isLoading = false;
            _this.notifications.generateNotification('Error', 'Error when trying to get specification', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    DesignNewComponent.prototype.loadOrganizationName = function () {
        var _this = this;
        this.orgService.getOrganizationName(this.specification.organizationId).subscribe(function (organizationName) {
            _this.labelValuesSpecification = _this.viewModelService.generateLabelValuesForSpecification(_this.specification, organizationName);
            _this.calculateFormValid();
            _this.isLoading = false;
        }, function (err) {
            _this.labelValuesSpecification = _this.viewModelService.generateLabelValuesForSpecification(_this.specification, '');
            _this.calculateFormValid();
            _this.isLoading = false;
            _this.notifications.generateNotification('Error', 'Error when trying to get organization', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    DesignNewComponent.prototype.resetXmlFile = function () {
        this.xml = null;
        this.fileUploadXml.resetFileSelection();
    };
    DesignNewComponent.prototype.updateUI = function () {
        if (this.xml) {
            this.parseDesign();
        }
        else {
            this.parsedDesign = null;
            this.setupLableValuesParsed();
        }
    };
    DesignNewComponent.prototype.parseDesign = function () {
        this.parsedDesign = null;
        try {
            var design = {};
            design.designAsXml = this.xml;
            design.designAsDoc = this.doc;
            design.name = this.xmlParser.getName(this.xml);
            design.description = this.xmlParser.getDescription(this.xml);
            design.designId = this.xmlParser.getMrn(this.xml);
            design.status = this.xmlParser.getStatus(this.xml);
            design.organizationId = this.organization.mrn;
            design.version = this.xmlParser.getVersion(this.xml);
            design.specifications = [this.specification];
            this.parsedDesign = design;
        }
        catch (error) {
            this.isRegistering = false;
            this.resetXmlFile();
            this.notifications.generateNotification('Error in XML', error.message, mc_notifications_service_1.MCNotificationType.Error, error);
        }
        finally {
            this.setupLableValuesParsed();
        }
    };
    DesignNewComponent.prototype.setupLableValuesParsed = function () {
        this.labelValuesParsed = [];
        this.labelValuesParsed.push({ label: 'Upload XML', valueHtml: '' });
        if (this.organization && this.parsedDesign) {
            this.labelValuesParsed = this.viewModelService.generateLabelValuesForDesign(this.parsedDesign, this.organization.name);
        }
    };
    __decorate([
        core_1.ViewChild('uploadXml'), 
        __metadata('design:type', (typeof (_a = typeof mcFileUploader_component_1.McFileUploader !== 'undefined' && mcFileUploader_component_1.McFileUploader) === 'function' && _a) || Object)
    ], DesignNewComponent.prototype, "fileUploadXml", void 0);
    DesignNewComponent = __decorate([
        core_1.Component({
            selector: 'design-new',
            encapsulation: core_1.ViewEncapsulation.None,
            template: __webpack_require__("./src/app/pages/org-service-registry/designs/components/design-new/design-new.html"),
            styles: []
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof design_xml_parser_service_1.DesignXmlParser !== 'undefined' && design_xml_parser_service_1.DesignXmlParser) === 'function' && _b) || Object, (typeof (_c = typeof mrn_helper_service_1.MrnHelperService !== 'undefined' && mrn_helper_service_1.MrnHelperService) === 'function' && _c) || Object, (typeof (_d = typeof router_1.ActivatedRoute !== 'undefined' && router_1.ActivatedRoute) === 'function' && _d) || Object, (typeof (_e = typeof xml_parser_service_1.XmlParserService !== 'undefined' && xml_parser_service_1.XmlParserService) === 'function' && _e) || Object, (typeof (_f = typeof sr_view_model_service_1.SrViewModelService !== 'undefined' && sr_view_model_service_1.SrViewModelService) === 'function' && _f) || Object, (typeof (_g = typeof navigation_helper_service_1.NavigationHelperService !== 'undefined' && navigation_helper_service_1.NavigationHelperService) === 'function' && _g) || Object, (typeof (_h = typeof mc_notifications_service_1.MCNotificationsService !== 'undefined' && mc_notifications_service_1.MCNotificationsService) === 'function' && _h) || Object, (typeof (_j = typeof designs_service_1.DesignsService !== 'undefined' && designs_service_1.DesignsService) === 'function' && _j) || Object, (typeof (_k = typeof organizations_service_1.OrganizationsService !== 'undefined' && organizations_service_1.OrganizationsService) === 'function' && _k) || Object, (typeof (_l = typeof specifications_service_1.SpecificationsService !== 'undefined' && specifications_service_1.SpecificationsService) === 'function' && _l) || Object])
    ], DesignNewComponent);
    return DesignNewComponent;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
}());
exports.DesignNewComponent = DesignNewComponent;


/***/ },

/***/ "./src/app/pages/org-service-registry/designs/components/design-new/design-new.html":
/***/ function(module, exports) {

module.exports = "<div class=\"row\">\n  <div class=\"col-lg-12\">\n    <ba-card title=\"Register new Design for {{organization?.name}}\" baCardClass=\"with-scroll table-panel\">\n      <h5 *ngIf=\"specification\">Registering a design for this specification</h5>\n      <mc-label-value-table [isLoading]=\"isLoading\" [labelValues]=\"labelValuesSpecification\"></mc-label-value-table>\n\n      <div class=\"separator\"></div>\n\n      <div *ngIf=\"specification\">\n        <form>\n          <mc-file-uploader #uploadXml [caption]=\"captionXml\" [fileUploadType]=\"fileTypeXml\" [requiredText]=\"requiredTextXml\" (onUpload)=\"onUploadXml($event)\"></mc-file-uploader>\n          <mc-file-uploader [caption]=\"captionDoc\" [fileUploadType]=\"fileTypeDoc\" [requiredText]=\"requiredTextDoc\" (onUpload)=\"onUploadDoc($event)\"></mc-file-uploader>\n          <div *ngIf=\"hasError\" class=\"error-notice\" [innerHTML]=\"errorText | undefined | sanitizeHtml\"></div>\n          <ul class=\"btn-list clearfix\">\n            <li>\n              <mc-loading-button [class]=\"registerButtonClass\" [disabled]=\"!isFormValid\" [isLoading]=\"isRegistering\" [title]=\"registerTitle\" [onClick]=\"onRegister\" ></mc-loading-button>\n            </li>\n            <li>\n              <button type=\"button\" class=\"btn btn-default btn-raised\" (click)=\"cancel()\">Cancel</button>\n            </li>\n          </ul>\n        </form>\n\n        <div class=\"separator\"></div>\n\n        <mc-label-value-table [isLoading]=\"false\" [labelValues]=\"labelValuesParsed\"></mc-label-value-table>\n      </div>\n      <div class=\"no-data\" *ngIf=\"!specification && !isLoading\">No data</div>\n    </ba-card>\n  </div>\n</div>\n"

/***/ },

/***/ "./src/app/pages/org-service-registry/designs/components/design-update/design-update.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var mc_notifications_service_1 = __webpack_require__("./src/app/shared/mc-notifications.service.ts");
var mcFileUploader_component_1 = __webpack_require__("./src/app/theme/components/mcFileUploader/mcFileUploader.component.ts");
var navigation_helper_service_1 = __webpack_require__("./src/app/shared/navigation-helper.service.ts");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var mrn_helper_service_1 = __webpack_require__("./src/app/shared/mrn-helper.service.ts");
var mcFormControlModel_1 = __webpack_require__("./src/app/theme/components/mcForm/mcFormControlModel.ts");
var forms_1 = __webpack_require__("./node_modules/@angular/forms/index.js");
var rxjs_1 = __webpack_require__("./node_modules/rxjs/Rx.js");
var designs_service_1 = __webpack_require__("./src/app/backend-api/service-registry/services/designs.service.ts");
var organizations_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/organizations.service.ts");
var sr_view_model_service_1 = __webpack_require__("./src/app/pages/org-service-registry/shared/services/sr-view-model.service.ts");
var specifications_service_1 = __webpack_require__("./src/app/backend-api/service-registry/services/specifications.service.ts");
var design_xml_parser_service_1 = __webpack_require__("./src/app/pages/org-service-registry/shared/services/design-xml-parser.service.ts");
var DesignUpdateComponent = (function () {
    function DesignUpdateComponent(orgsService, viewModelService, formBuilder, xmlParser, mrnHelper, router, activatedRoute, navigationService, notifications, specificationsService, designService) {
        this.orgsService = orgsService;
        this.viewModelService = viewModelService;
        this.formBuilder = formBuilder;
        this.xmlParser = xmlParser;
        this.mrnHelper = mrnHelper;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.navigationService = navigationService;
        this.notifications = notifications;
        this.specificationsService = specificationsService;
        this.designService = designService;
        this.hasError = false;
        this.captionXml = 'Upload Design XML file';
        this.captionDoc = 'Upload Design Document file';
        this.fileTypeXml = mcFileUploader_component_1.FileUploadType.Xml;
        this.fileTypeDoc = mcFileUploader_component_1.FileUploadType.Doc;
        this.isLoading = true;
        this.isUpdating = false;
        this.updateTitle = "Update Design";
        this.isFormChanged = false;
        this.status = '';
    }
    DesignUpdateComponent.prototype.ngOnInit = function () {
        this.isUpdating = false;
        this.isLoading = true;
        this.loadDesign();
        this.updateUI();
    };
    DesignUpdateComponent.prototype.setFormChanged = function () {
        var changed = false;
        if (this.xml || this.doc) {
            changed = true;
        }
        else if (this.status != this.design.status) {
            changed = true;
        }
        this.isFormChanged = changed;
    };
    DesignUpdateComponent.prototype.onUploadDoc = function (file) {
        this.doc = file;
        this.hasError = false;
        this.setFormChanged();
        this.generateForm();
    };
    DesignUpdateComponent.prototype.onUploadXml = function (file) {
        var _this = this;
        this.hasError = false;
        if (file) {
            this.isXmlValid(file).subscribe(function (isValid) {
                _this.hasError = !isValid;
                if (isValid) {
                    _this.xml = file;
                }
                else {
                    _this.resetXmlFile();
                }
                _this.setFormChanged();
                _this.generateForm();
                _this.updateUI();
            });
        }
        else {
            this.hasError = false;
            this.resetXmlFile();
            this.setFormChanged();
            this.generateForm();
            this.updateUI();
        }
    };
    DesignUpdateComponent.prototype.resetXmlFile = function () {
        this.status = this.design.status;
        this.xml = null;
        this.fileUploadXml.resetFileSelection();
        this.updateUI();
    };
    DesignUpdateComponent.prototype.updateUI = function () {
        if (this.xml) {
            this.parseDesign();
        }
        else {
            this.parsedDesign = null;
            this.setupLableValuesParsed();
        }
    };
    DesignUpdateComponent.prototype.isXmlValid = function (file) {
        var _this = this;
        try {
            var specificationMrn_1 = this.xmlParser.getMrnForSpecificationInDesign(file);
            var specificationVersion_1 = this.xmlParser.getVersionForSpecificationInDesign(file);
            var isSpecificationTheSame = this.isSpecificationSameAsBefore(specificationMrn_1, specificationVersion_1);
            if (isSpecificationTheSame) {
                var parseValid = this.parseDisplayValues(file);
                return rxjs_1.Observable.of(parseValid);
            }
            else {
                return rxjs_1.Observable.create(function (observer) {
                    _this.specificationsService.getSpecification(specificationMrn_1, specificationVersion_1).subscribe(function (specification) {
                        _this.design.specifications = [specification];
                        var parseValid = _this.parseDisplayValues(file);
                        observer.next(parseValid);
                    }, function (err) {
                        if (err.status == 404) {
                            _this.errorText = "The MRN and version referencing the Specification in the XML, doesn't match any Specifications in Service Registry<BR><BR>"
                                + "Xml-parsed Specification: " + specificationMrn_1 + ", version: " + specificationVersion_1 + "<BR>";
                        }
                        else {
                            _this.errorText = "Error when trying to validate implemented specification.<BR>";
                            // If error isn't "Not found" then another error occured and we can't proceed
                            _this.notifications.generateNotification('Error when trying to validate implemented specification: ', err.message, mc_notifications_service_1.MCNotificationType.Error, err);
                        }
                        observer.next(false);
                    });
                });
            }
        }
        catch (error) {
            this.errorText = "Error in XML.<BR>";
            this.notifications.generateNotification('Error in XML', error.message, mc_notifications_service_1.MCNotificationType.Error, error);
            return rxjs_1.Observable.of(false);
        }
    };
    DesignUpdateComponent.prototype.parseDesign = function () {
        this.parsedDesign = null;
        try {
            if (this.xml) {
                var design = _.cloneDeep(this.design);
                // Already contains an XML, so just update the values and not the ID
                design.designAsXml.content = this.xml.content;
                design.designAsXml.contentContentType = this.xml.contentContentType;
                design.designAsXml.name = this.xml.name;
                design.name = this.xmlParser.getName(this.xml);
                design.description = this.xmlParser.getDescription(this.xml);
                design.status = this.xmlParser.getStatus(this.xml);
                design.version = this.xmlParser.getVersion(this.xml);
                this.parsedDesign = design;
            }
        }
        catch (error) {
            this.isUpdating = false;
            this.notifications.generateNotification('Error in XML', error.message, mc_notifications_service_1.MCNotificationType.Error, error);
            this.resetXmlFile();
        }
        finally {
            this.setupLableValuesParsed();
        }
    };
    DesignUpdateComponent.prototype.parseDisplayValues = function (file) {
        this.status = this.xmlParser.getStatus(file);
        var parsedMrn = this.xmlParser.getMrn(file);
        var parsedVersion = this.xmlParser.getVersion(file);
        if (parsedMrn != this.design.designId || parsedVersion != this.design.version) {
            this.errorText = "The MRN and Version in the XML are not the same as the MRN and Version of this Design. If the MRN or Version needs to be changed, please create a NEW Design instead of updating an existing.<BR><BR>"
                + "Xml-parsed MRN: " + parsedMrn + "<BR>"
                + "Xml-parsed Version: " + parsedVersion + "<BR>";
            return false;
        }
        else {
            return true;
        }
    };
    DesignUpdateComponent.prototype.setupLableValuesParsed = function () {
        var _this = this;
        this.labelValuesParsed = [];
        this.labelValuesParsed.push({ label: 'Upload XML', valueHtml: '' });
        if (this.parsedDesign) {
            this.orgsService.getOrganizationName(this.design.organizationId).subscribe(function (organizationName) {
                _this.labelValuesParsed = _this.viewModelService.generateLabelValuesForDesign(_this.parsedDesign, organizationName);
            }, function (err) {
                _this.labelValuesParsed = _this.viewModelService.generateLabelValuesForDesign(_this.parsedDesign, '');
                _this.notifications.generateNotification('Error', 'Error when trying to get organization', mc_notifications_service_1.MCNotificationType.Error, err);
            });
        }
    };
    DesignUpdateComponent.prototype.isSpecificationSameAsBefore = function (specificationMrn, specificationVersion) {
        try {
            var specificationMrnFromDesign = this.xmlParser.getMrnForSpecificationInDesign(this.design.designAsXml);
            var specificationVersionFromDesign = this.xmlParser.getVersionForSpecificationInDesign(this.design.designAsXml);
            var isSameMrn = specificationMrnFromDesign === specificationMrn;
            var isSameVersion = specificationVersionFromDesign === specificationVersion;
            return isSameMrn && isSameVersion;
        }
        catch (error) {
            return false;
        }
    };
    DesignUpdateComponent.prototype.cancel = function () {
        this.navigationService.navigateToOrgDesign(this.designIdFromRoute, this.versionFromRoute);
    };
    DesignUpdateComponent.prototype.update = function () {
        this.isUpdating = true;
        if (this.xml || this.doc) {
            if (this.xml) {
                this.design = this.parsedDesign;
            }
            if (this.doc) {
                if (this.design.designAsDoc) {
                    this.design.designAsDoc.filecontent = this.doc.filecontent;
                    this.design.designAsDoc.filecontentContentType = this.doc.filecontentContentType;
                    this.design.designAsDoc.name = this.doc.name;
                }
                else {
                    this.design.designAsDoc = this.doc;
                }
            }
            this.updateDesign();
        }
        else {
            this.status = this.updateForm.value.status;
            this.updateStatus();
        }
    };
    DesignUpdateComponent.prototype.updateStatus = function () {
        var _this = this;
        this.designService.updateStatus(this.design, this.status).subscribe(function (_) {
            _this.navigationService.navigateToOrgDesign(_this.design.designId, _this.design.version);
        }, function (err) {
            _this.isUpdating = false;
            _this.notifications.generateNotification('Error', 'Error when trying to update status of design', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    DesignUpdateComponent.prototype.updateDesign = function () {
        var _this = this;
        var updateDoc = this.doc != null;
        var updateXml = this.xml != null;
        this.designService.updateDesign(this.design, updateDoc, updateXml).subscribe(function (_) {
            _this.navigationService.navigateToOrgDesign(_this.design.designId, _this.design.version);
        }, function (err) {
            _this.isUpdating = false;
            _this.notifications.generateNotification('Error', 'Error when trying to update design', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    DesignUpdateComponent.prototype.loadDesign = function () {
        var _this = this;
        this.designIdFromRoute = this.activatedRoute.snapshot.params['id'];
        this.versionFromRoute = this.activatedRoute.snapshot.queryParams['designVersion'];
        this.designService.getDesign(this.designIdFromRoute, this.versionFromRoute).subscribe(function (design) {
            _this.design = design;
            _this.status = _this.design.status;
            _this.generateLabelValues();
            _this.generateForm();
            _this.isLoading = false;
        }, function (err) {
            // TODO: make this as a general component
            if (err.status == 404) {
                _this.router.navigate(['/error404'], { relativeTo: _this.activatedRoute, replaceUrl: true });
            }
            _this.isLoading = false;
            _this.notifications.generateNotification('Error', 'Error when trying to get design', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    DesignUpdateComponent.prototype.generateLabelValues = function () {
        this.labelValues = [];
        this.labelValues.push({ label: 'MRN', valueHtml: this.design.designId });
        this.labelValues.push({ label: 'Name', valueHtml: this.design.name });
        this.labelValues.push({ label: 'Version', valueHtml: this.design.version });
    };
    DesignUpdateComponent.prototype.setStatus = function (status) {
        this.status = status;
        this.setFormChanged();
    };
    DesignUpdateComponent.prototype.generateForm = function () {
        var _this = this;
        this.updateForm = this.formBuilder.group({});
        this.formControlModels = [];
        var formControlModel;
        var disableStatus = this.xml != null || this.doc != null;
        // TODO Get dynamically from XSD
        var statusSelect = [{ label: "provisional", value: "provisional", isSelected: false },
            { label: "released", value: "released", isSelected: false }, { label: "deprecated", value: "deprecated", isSelected: false },
            { label: "deleted", value: "deleted", isSelected: false }];
        statusSelect.forEach(function (status) { if (status.value === _this.status)
            status.isSelected = true; });
        if (disableStatus) {
            formControlModel = { selectValues: statusSelect, showCheckmark: false, formGroup: this.updateForm, elementId: 'status', controlType: mcFormControlModel_1.McFormControlType.Select, labelName: 'Status', placeholder: '', isDisabled: disableStatus };
        }
        else {
            formControlModel = { selectValues: statusSelect, showCheckmark: false, formGroup: this.updateForm, elementId: 'status', controlType: mcFormControlModel_1.McFormControlType.Select, labelName: 'Status', placeholder: '' };
        }
        var formControl = new forms_1.FormControl(this.status, formControlModel.validator);
        formControl.valueChanges.subscribe(function (param) { return _this.setStatus(param); });
        this.updateForm.addControl(formControlModel.elementId, formControl);
        this.formControlModels.push(formControlModel);
    };
    __decorate([
        core_1.ViewChild('uploadXml'), 
        __metadata('design:type', (typeof (_a = typeof mcFileUploader_component_1.McFileUploader !== 'undefined' && mcFileUploader_component_1.McFileUploader) === 'function' && _a) || Object)
    ], DesignUpdateComponent.prototype, "fileUploadXml", void 0);
    DesignUpdateComponent = __decorate([
        core_1.Component({
            selector: 'design-update',
            encapsulation: core_1.ViewEncapsulation.None,
            template: __webpack_require__("./src/app/pages/org-service-registry/designs/components/design-update/design-update.html"),
            styles: []
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof organizations_service_1.OrganizationsService !== 'undefined' && organizations_service_1.OrganizationsService) === 'function' && _b) || Object, (typeof (_c = typeof sr_view_model_service_1.SrViewModelService !== 'undefined' && sr_view_model_service_1.SrViewModelService) === 'function' && _c) || Object, (typeof (_d = typeof forms_1.FormBuilder !== 'undefined' && forms_1.FormBuilder) === 'function' && _d) || Object, (typeof (_e = typeof design_xml_parser_service_1.DesignXmlParser !== 'undefined' && design_xml_parser_service_1.DesignXmlParser) === 'function' && _e) || Object, (typeof (_f = typeof mrn_helper_service_1.MrnHelperService !== 'undefined' && mrn_helper_service_1.MrnHelperService) === 'function' && _f) || Object, (typeof (_g = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _g) || Object, (typeof (_h = typeof router_1.ActivatedRoute !== 'undefined' && router_1.ActivatedRoute) === 'function' && _h) || Object, (typeof (_j = typeof navigation_helper_service_1.NavigationHelperService !== 'undefined' && navigation_helper_service_1.NavigationHelperService) === 'function' && _j) || Object, (typeof (_k = typeof mc_notifications_service_1.MCNotificationsService !== 'undefined' && mc_notifications_service_1.MCNotificationsService) === 'function' && _k) || Object, (typeof (_l = typeof specifications_service_1.SpecificationsService !== 'undefined' && specifications_service_1.SpecificationsService) === 'function' && _l) || Object, (typeof (_m = typeof designs_service_1.DesignsService !== 'undefined' && designs_service_1.DesignsService) === 'function' && _m) || Object])
    ], DesignUpdateComponent);
    return DesignUpdateComponent;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
}());
exports.DesignUpdateComponent = DesignUpdateComponent;


/***/ },

/***/ "./src/app/pages/org-service-registry/designs/components/design-update/design-update.html":
/***/ function(module, exports) {

module.exports = "<div class=\"row\">\n  <div class=\"col-lg-12\">\n    <ba-card title=\"Update Design - {{design?.name}}\" baCardClass=\"with-scroll table-panel\">\n      <h5>Updating Design</h5>\n      <mc-label-value-table [isLoading]=\"isLoading\" [labelValues]=\"labelValues\"></mc-label-value-table>\n\n      <div class=\"separator\"></div>\n\n      <div *ngIf=\"design\">\n        <div class=\"important-notice-big\">\n          If only the <span>status</span> needs to be updated, leave the <span>XML</span> and <span>Document</span> fields empty.<br>\n          <br>\n          If a new XML-file is uploaded the <span>status</span> will be parsed from the XML.\n        </div>\n        <div class=\"separator\"></div>\n        <form>\n          <mc-file-uploader #uploadXml [caption]=\"captionXml\" [fileUploadType]=\"fileTypeXml\" (onUpload)=\"onUploadXml($event)\"></mc-file-uploader>\n          <mc-file-uploader [caption]=\"captionDoc\" [fileUploadType]=\"fileTypeDoc\" (onUpload)=\"onUploadDoc($event)\"></mc-file-uploader>\n          <div *ngIf=\"hasError\" class=\"error-notice\" [innerHTML]=\"errorText | undefined | sanitizeHtml\"></div>\n          <mc-form [isFormValid]=\"isFormChanged\" [formGroup]=\"updateForm\" [formControlModels]=\"formControlModels\" [isLoading]=\"isLoading\" [isRegistering]=\"isUpdating\" [registerTitle]=\"updateTitle\" (onCancel)=\"cancel()\" (onRegister)=\"update()\"></mc-form>\n        </form>\n\n        <div class=\"separator\"></div>\n\n        <mc-label-value-table [isLoading]=\"false\" [labelValues]=\"labelValuesParsed\"></mc-label-value-table>\n      </div>\n      <div class=\"no-data\" *ngIf=\"!design && !isLoading\">No data</div>\n    </ba-card>\n  </div>\n</div>\n"

/***/ },

/***/ "./src/app/pages/org-service-registry/designs/designs.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var DesignsComponent = (function () {
    function DesignsComponent() {
    }
    DesignsComponent = __decorate([
        core_1.Component({
            selector: 'designs',
            template: "<router-outlet></router-outlet>"
        }), 
        __metadata('design:paramtypes', [])
    ], DesignsComponent);
    return DesignsComponent;
}());
exports.DesignsComponent = DesignsComponent;


/***/ },

/***/ "./src/app/pages/org-service-registry/designs/designs.module.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var common_1 = __webpack_require__("./node_modules/@angular/common/index.js");
var designs_routing_1 = __webpack_require__("./src/app/pages/org-service-registry/designs/designs.routing.ts");
var nga_module_1 = __webpack_require__("./src/app/theme/nga.module.ts");
var designs_component_1 = __webpack_require__("./src/app/pages/org-service-registry/designs/designs.component.ts");
var design_list_component_1 = __webpack_require__("./src/app/pages/org-service-registry/designs/components/design-list/design-list.component.ts");
var design_details_component_1 = __webpack_require__("./src/app/pages/org-service-registry/designs/components/design-details/design-details.component.ts");
var shared_module_1 = __webpack_require__("./src/app/pages/shared/shared.module.ts");
var design_new_component_1 = __webpack_require__("./src/app/pages/org-service-registry/designs/components/design-new/design-new.component.ts");
var design_update_component_1 = __webpack_require__("./src/app/pages/org-service-registry/designs/components/design-update/design-update.component.ts");
var DesignsModule = (function () {
    function DesignsModule() {
    }
    DesignsModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                nga_module_1.NgaModule,
                shared_module_1.SharedModule,
                designs_routing_1.routing
            ],
            declarations: [
                designs_component_1.DesignsComponent,
                design_list_component_1.DesignListComponent,
                design_details_component_1.DesignDetailsComponent,
                design_new_component_1.DesignNewComponent,
                design_update_component_1.DesignUpdateComponent
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], DesignsModule);
    return DesignsModule;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DesignsModule;


/***/ },

/***/ "./src/app/pages/org-service-registry/designs/designs.routing.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var designs_component_1 = __webpack_require__("./src/app/pages/org-service-registry/designs/designs.component.ts");
var design_list_component_1 = __webpack_require__("./src/app/pages/org-service-registry/designs/components/design-list/design-list.component.ts");
var design_details_component_1 = __webpack_require__("./src/app/pages/org-service-registry/designs/components/design-details/design-details.component.ts");
var design_new_component_1 = __webpack_require__("./src/app/pages/org-service-registry/designs/components/design-new/design-new.component.ts");
var design_update_component_1 = __webpack_require__("./src/app/pages/org-service-registry/designs/components/design-update/design-update.component.ts");
// noinspection TypeScriptValidateTypes
exports.designRoutes = [
    {
        path: 'designs',
        component: designs_component_1.DesignsComponent,
        data: { breadcrumb: 'Designs' },
        children: [
            {
                path: '',
                component: design_list_component_1.DesignListComponent
            },
            {
                path: 'register',
                component: design_new_component_1.DesignNewComponent,
                data: { breadcrumb: 'Register' }
            },
            {
                path: ':id',
                component: design_details_component_1.DesignDetailsComponent,
                data: { breadcrumb: 'Details' }
            },
            {
                path: 'update/:id',
                component: design_update_component_1.DesignUpdateComponent,
                data: { breadcrumb: 'Update' }
            }
        ]
    }
];
exports.routing = router_1.RouterModule.forChild(exports.designRoutes);


/***/ },

/***/ "./src/app/pages/org-service-registry/instances/components/instance-details/instance-details.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var mc_notifications_service_1 = __webpack_require__("./src/app/shared/mc-notifications.service.ts");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var file_helper_service_1 = __webpack_require__("./src/app/shared/file-helper.service.ts");
var navigation_helper_service_1 = __webpack_require__("./src/app/shared/navigation-helper.service.ts");
var instances_service_1 = __webpack_require__("./src/app/backend-api/service-registry/services/instances.service.ts");
var designs_service_1 = __webpack_require__("./src/app/backend-api/service-registry/services/designs.service.ts");
var sr_view_model_service_1 = __webpack_require__("./src/app/pages/org-service-registry/shared/services/sr-view-model.service.ts");
var auth_service_1 = __webpack_require__("./src/app/authentication/services/auth.service.ts");
var mrn_helper_service_1 = __webpack_require__("./src/app/shared/mrn-helper.service.ts");
var id_services_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/id-services.service.ts");
var docs_service_1 = __webpack_require__("./src/app/backend-api/service-registry/services/docs.service.ts");
var organizations_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/organizations.service.ts");
var app_constants_1 = __webpack_require__("./src/app/shared/app.constants.ts");
var endorsements_service_1 = __webpack_require__("./src/app/backend-api/endorsements/services/endorsements.service.ts");
var instance_xml_parser_service_1 = __webpack_require__("./src/app/pages/org-service-registry/shared/services/instance-xml-parser.service.ts");
var Observable_1 = __webpack_require__("./node_modules/rxjs/Observable.js");
var util_1 = __webpack_require__("./node_modules/util/util.js");
var InstanceDetailsComponent = (function () {
    function InstanceDetailsComponent(servicesService, endorsementsService, authService, route, router, viewModelService, navigationHelperService, instancesService, notifications, designsService, fileHelperService, mrnHelper, docsService, orgsService, xmlParser) {
        this.servicesService = servicesService;
        this.endorsementsService = endorsementsService;
        this.authService = authService;
        this.route = route;
        this.router = router;
        this.viewModelService = viewModelService;
        this.navigationHelperService = navigationHelperService;
        this.instancesService = instancesService;
        this.notifications = notifications;
        this.designsService = designsService;
        this.fileHelperService = fileHelperService;
        this.mrnHelper = mrnHelper;
        this.docsService = docsService;
        this.orgsService = orgsService;
        this.xmlParser = xmlParser;
        this.showModal = false;
        this.shouldDisplayIdService = false;
        this.shouldDisplayCreateButton = false;
        this.showUpdateIdService = false;
        this.endorsements = [];
        this.endorseMainSwitch = app_constants_1.SHOW_ENDORSEMENTS;
    }
    InstanceDetailsComponent.prototype.ngOnInit = function () {
        this.onGotoDesign = this.gotoDesign.bind(this);
        this.shouldDisplayCreateButton = false;
        this.isLoadingInstance = true;
        this.isLoadingIdService = true;
        this.title = 'Loading ...';
        this.titleIdService = 'ID information';
        var instanceId = this.route.snapshot.params['id'];
        var version = this.route.snapshot.queryParams['instanceVersion'];
        this.loadInstance(instanceId, version);
        if (app_constants_1.SHOW_ENDORSEMENTS) {
            this.loadEndorsements(instanceId, version);
        }
    };
    InstanceDetailsComponent.prototype.downloadXml = function () {
        this.fileHelperService.downloadXml(this.instance.instanceAsXml);
    };
    InstanceDetailsComponent.prototype.downloadDoc = function () {
        this.fileHelperService.downloadDoc(this.instance.instanceAsDoc);
    };
    InstanceDetailsComponent.prototype.createIdService = function () {
        this.navigationHelperService.navigateToCreateIdService(this.instance.instanceId, this.instance.name, this.instance.version);
    };
    InstanceDetailsComponent.prototype.isMyOrg = function () {
        return this.instance.organizationId === this.authService.authState.orgMrn;
    };
    InstanceDetailsComponent.prototype.loadInstance = function (instanceId, version) {
        var _this = this;
        this.instancesService.getInstance(instanceId, version).subscribe(function (instance) {
            _this.title = instance.name;
            _this.instance = instance;
            _this.loadDesign();
            _this.WKTs = _this.xmlParser.getGeometriesAsWKT(_this.instance.instanceAsXml);
        }, function (err) {
            // TODO: make this as a general component
            if (err.status == 404) {
                _this.router.navigate(['/error404'], { relativeTo: _this.route, replaceUrl: true });
            }
            _this.title = 'Error while loading';
            _this.isLoadingInstance = false;
            _this.notifications.generateNotification('Error', 'Error when trying to get instance', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    InstanceDetailsComponent.prototype.loadOrganizationName = function () {
        var _this = this;
        this.orgsService.getOrganizationName(this.instance.organizationId).subscribe(function (organizationName) {
            _this.labelValues = _this.viewModelService.generateLabelValuesForInstance(_this.instance, organizationName);
            _this.finalizeLoading();
        }, function (err) {
            _this.labelValues = _this.viewModelService.generateLabelValuesForInstance(_this.instance, '');
            _this.finalizeLoading();
            _this.notifications.generateNotification('Error', 'Error when trying to get organization', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    InstanceDetailsComponent.prototype.finalizeLoading = function () {
        this.generateLabelValueForDesign();
        this.isLoadingInstance = false;
        if (this.isMyOrg() || this.authService.authState.hasPermission(auth_service_1.AuthPermission.SiteAdmin)) {
            this.shouldDisplayIdService = true;
            this.loadIdService(this.instance.instanceId);
        }
    };
    InstanceDetailsComponent.prototype.loadIdService = function (mrn) {
        var _this = this;
        this.servicesService.getIdService(mrn, this.instance.version, this.instance.organizationId).subscribe(function (service) {
            service.name = _this.instance.name;
            _this.idService = service;
            _this.showUpdateIdService = (_this.isMyOrg() && _this.isServiceAdminForOrg()) /* TODO for now only update if my org, because updating another orgs entities is a quite different kind of woopass|| this.authService.authState.isSiteAdmin()*/;
            _this.isLoadingIdService = false;
        }, function (err) {
            if (err.status == 404) {
                _this.shouldDisplayIdService = false;
                _this.shouldDisplayCreateButton = _this.isServiceAdminForOrg();
            }
            else {
                _this.notifications.generateNotification('Error', 'Error when trying to get the service', mc_notifications_service_1.MCNotificationType.Error, err);
            }
            _this.isLoadingIdService = false;
        });
    };
    InstanceDetailsComponent.prototype.loadDesign = function () {
        var _this = this;
        this.designsService.getDesignForInstance(this.instance).subscribe(function (design) {
            _this.design = design;
            _this.loadOrganizationName();
        }, function (err) {
            _this.isLoadingInstance = false;
            _this.notifications.generateNotification('Error', 'Error when trying to get design', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    InstanceDetailsComponent.prototype.generateLabelValueForDesign = function () {
        if (this.design) {
            var label = 'Implemented design';
            this.labelValues.push({ label: label, valueHtml: this.design.name + " - " + this.design.version, linkFunction: this.onGotoDesign, linkValue: [this.design.designId, this.design.version] });
        }
    };
    InstanceDetailsComponent.prototype.updateIdService = function () {
        this.navigationHelperService.navigateToUpdateIdService(this.idService.mrn, this.instance.version);
    };
    InstanceDetailsComponent.prototype.gotoDesign = function (linkValue) {
        try {
            this.navigationHelperService.navigateToOrgDesign(linkValue[0], linkValue[1]);
        }
        catch (error) {
            this.notifications.generateNotification('Error', 'Error when trying to go to instance', mc_notifications_service_1.MCNotificationType.Error, error);
        }
    };
    InstanceDetailsComponent.prototype.isServiceAdminForOrg = function () {
        return (this.authService.authState.hasPermission(auth_service_1.AuthPermission.ServiceAdmin) && this.isMyOrg()) || this.authService.authState.hasPermission(auth_service_1.AuthPermission.SiteAdmin);
    };
    InstanceDetailsComponent.prototype.showUpdate = function () {
        return this.isServiceAdminForOrg();
    };
    InstanceDetailsComponent.prototype.showDelete = function () {
        return this.isServiceAdminForOrg();
    };
    InstanceDetailsComponent.prototype.update = function () {
        this.navigationHelperService.navigateToUpdateInstance(this.instance.instanceId, this.instance.version);
    };
    InstanceDetailsComponent.prototype.delete = function () {
        this.modalDescription = 'Do you want to delete the instance?';
        this.showModal = true;
    };
    InstanceDetailsComponent.prototype.cancelModal = function () {
        this.showModal = false;
    };
    InstanceDetailsComponent.prototype.deleteForSure = function () {
        var _this = this;
        this.isLoadingInstance = true;
        this.showModal = false;
        this.instancesService.deleteInstance(this.instance).subscribe(function () {
            _this.deleteEndorsements();
        }, function (err) {
            _this.isLoadingInstance = false;
            _this.notifications.generateNotification('Error', 'Error when trying to delete instance', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    InstanceDetailsComponent.prototype.deleteIdService = function () {
        var _this = this;
        if (this.idService) {
            this.servicesService.deleteIdService(this.idService.mrn, this.instance.version).subscribe(function () {
                _this.navigationHelperService.navigateToOrgInstance('', '');
            }, function (err) {
                _this.notifications.generateNotification('Error', 'Error when trying to delete ID', mc_notifications_service_1.MCNotificationType.Error, err);
                _this.navigationHelperService.navigateToOrgInstance('', '');
            });
        }
        else {
            this.navigationHelperService.navigateToOrgInstance('', '');
        }
    };
    InstanceDetailsComponent.prototype.isAdmin = function () {
        return this.authService.authState.hasPermission(auth_service_1.AuthPermission.ServiceAdmin);
    };
    InstanceDetailsComponent.prototype.isEndorseAdmin = function () {
        return this.authService.authState.hasPermission(auth_service_1.AuthPermission.OrgAdmin);
    };
    // Endorsements
    InstanceDetailsComponent.prototype.deleteEndorsements = function () {
        var _this = this;
        if (this.endorsements && this.endorsements.length > 0) {
            this.endorsementsService.removeAllEndorsementsOfInstance(this.instance.instanceId).subscribe(function () {
                _this.deleteIdService();
            }, function (err) {
                _this.notifications.generateNotification('Error', 'Error when trying to delete endorsements of instance', mc_notifications_service_1.MCNotificationType.Error, err);
                _this.deleteIdService();
            });
        }
        else {
            this.deleteIdService();
        }
    };
    InstanceDetailsComponent.prototype.loadEndorsements = function (instanceId, instanceVersion) {
        var _this = this;
        this.isLoadingEndorsements = true;
        var parallelObservables = [];
        parallelObservables.push(this.endorsementsService.isInstanceEndorsedByMyOrg(instanceId, instanceVersion).take(1));
        parallelObservables.push(this.endorsementsService.getEndorsementsForInstance(instanceId, instanceVersion).take(1));
        return Observable_1.Observable.forkJoin(parallelObservables).subscribe(function (resultArray) {
            var isEndorsedByMyOrg = resultArray[0];
            var pageEndorsement = resultArray[1];
            _this.endorsements = pageEndorsement.content;
            _this.isEndorsedByMyOrg = isEndorsedByMyOrg;
            _this.isLoadingEndorsements = false;
            _this.showEndorsements = true;
        }, function (err) {
            _this.showEndorsements = false;
            _this.isLoadingEndorsements = false;
            _this.notifications.generateNotification('Error', 'Error when trying to get endorsements for instance', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    InstanceDetailsComponent.prototype.endorseToggle = function () {
        if (this.isEndorsedByMyOrg) {
            this.removeEndorse();
        }
        else {
            this.endorse();
        }
    };
    InstanceDetailsComponent.prototype.endorse = function () {
        var _this = this;
        this.isEndorsing = true;
        this.endorsementsService.endorseInstance(this.instance.instanceId, this.instance.version, this.design.designId, this.design.version).subscribe(function (_) {
            _this.isEndorsedByMyOrg = true;
            _this.isEndorsing = false;
            _this.loadEndorsements(_this.instance.instanceId, _this.instance.version);
        }, function (err) {
            _this.isEndorsing = false;
            _this.notifications.generateNotification('Error', 'Error when trying to endorse instance', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    InstanceDetailsComponent.prototype.removeEndorse = function () {
        var _this = this;
        this.isEndorsing = true;
        this.endorsementsService.removeEndorsementOfInstance(this.instance.instanceId, this.instance.version).subscribe(function (_) {
            _this.isEndorsedByMyOrg = false;
            _this.isEndorsing = false;
            _this.loadEndorsements(_this.instance.instanceId, _this.instance.version);
        }, function (err) {
            _this.isEndorsing = false;
            _this.notifications.generateNotification('Error', 'Error when trying to remove endorse of instance', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    InstanceDetailsComponent.prototype.shouldDisplayEndorsementButton = function () {
        return app_constants_1.SHOW_ENDORSEMENTS && this.isEndorseAdmin() && this.showEndorsements && !util_1.isNullOrUndefined(this.design);
    };
    InstanceDetailsComponent = __decorate([
        core_1.Component({
            selector: 'instance-details',
            encapsulation: core_1.ViewEncapsulation.None,
            template: __webpack_require__("./src/app/pages/org-service-registry/instances/components/instance-details/instance-details.html"),
            styles: []
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof id_services_service_1.IdServicesService !== 'undefined' && id_services_service_1.IdServicesService) === 'function' && _a) || Object, (typeof (_b = typeof endorsements_service_1.EndorsementsService !== 'undefined' && endorsements_service_1.EndorsementsService) === 'function' && _b) || Object, (typeof (_c = typeof auth_service_1.AuthService !== 'undefined' && auth_service_1.AuthService) === 'function' && _c) || Object, (typeof (_d = typeof router_1.ActivatedRoute !== 'undefined' && router_1.ActivatedRoute) === 'function' && _d) || Object, (typeof (_e = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _e) || Object, (typeof (_f = typeof sr_view_model_service_1.SrViewModelService !== 'undefined' && sr_view_model_service_1.SrViewModelService) === 'function' && _f) || Object, (typeof (_g = typeof navigation_helper_service_1.NavigationHelperService !== 'undefined' && navigation_helper_service_1.NavigationHelperService) === 'function' && _g) || Object, (typeof (_h = typeof instances_service_1.InstancesService !== 'undefined' && instances_service_1.InstancesService) === 'function' && _h) || Object, (typeof (_j = typeof mc_notifications_service_1.MCNotificationsService !== 'undefined' && mc_notifications_service_1.MCNotificationsService) === 'function' && _j) || Object, (typeof (_k = typeof designs_service_1.DesignsService !== 'undefined' && designs_service_1.DesignsService) === 'function' && _k) || Object, (typeof (_l = typeof file_helper_service_1.FileHelperService !== 'undefined' && file_helper_service_1.FileHelperService) === 'function' && _l) || Object, (typeof (_m = typeof mrn_helper_service_1.MrnHelperService !== 'undefined' && mrn_helper_service_1.MrnHelperService) === 'function' && _m) || Object, (typeof (_o = typeof docs_service_1.DocsService !== 'undefined' && docs_service_1.DocsService) === 'function' && _o) || Object, (typeof (_p = typeof organizations_service_1.OrganizationsService !== 'undefined' && organizations_service_1.OrganizationsService) === 'function' && _p) || Object, (typeof (_q = typeof instance_xml_parser_service_1.InstanceXmlParser !== 'undefined' && instance_xml_parser_service_1.InstanceXmlParser) === 'function' && _q) || Object])
    ], InstanceDetailsComponent);
    return InstanceDetailsComponent;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
}());
exports.InstanceDetailsComponent = InstanceDetailsComponent;


/***/ },

/***/ "./src/app/pages/org-service-registry/instances/components/instance-details/instance-details.html":
/***/ function(module, exports) {

module.exports = "<div class=\"row\">\n  <div class=\"col-lg-12\">\n    <ba-card title=\"{{title}}\" baCardClass=\"with-scroll table-panel\">\n      <mc-label-value-table [isLoading]=\"isLoadingInstance\" [labelValues]=\"labelValues\"></mc-label-value-table>\n      <ul *ngIf=\"instance && !isLoadingInstance\" class=\"btn-list clearfix\">\n        <li *ngIf=\"instance.instanceAsDoc\">\n          <button type=\"button\" class=\"btn btn-primary btn-raised\" (click)=\"downloadDoc()\">Download document</button>\n        </li>\n        <li *ngIf=\"instance.instanceAsXml\">\n          <button type=\"button\" class=\"btn btn-primary btn-raised\" (click)=\"downloadXml()\">Download XML</button>\n        </li>\n        <li *ngIf=\"showUpdate()\">\n          <button type=\"button\" class=\"btn btn-primary btn-raised\" (click)=\"update()\">Update Instance</button>\n        </li>\n        <li *ngIf=\"showDelete()\">\n          <button type=\"button\" class=\"btn btn-danger btn-raised\" (click)=\"delete()\">Delete Instance</button>\n        </li>\n        <li *ngIf=\"shouldDisplayEndorsementButton() && !isLoadingInstance\">\n          <mc-endorse-button [isEndorsedByMyOrg]=\"isEndorsedByMyOrg\" [isEndorsing]=\"isEndorsing\" [title]=\"'Instance'\" (onEndorse)=\"endorseToggle()\"></mc-endorse-button>\n        </li>\n      </ul>\n    </ba-card>\n\n    <ba-card *ngIf=\"WKTs\" title=\"Coverage Area of {{title}}\" baCardClass=\"with-scroll table-panel\">\n      <mc-coverage-map [WKTs]=\"WKTs\" [isLoading]=\"isLoadingInstance\">Loading...</mc-coverage-map>\n    </ba-card>\n\n    <div *ngIf=\"shouldDisplayIdService\">\n      <service-details-view [shouldShowUpdate]=\"showUpdateIdService\" (updateAction)=\"updateIdService()\" [shouldShowLinkToInstance]=\"false\" [shouldShowDelete]=\"false\" [isLoading]=\"isLoadingIdService\" [title]=\"titleIdService\" [service]=\"idService\"></service-details-view>\n    </div>\n\n    <div *ngIf=\"shouldDisplayCreateButton\">\n      <ba-card title=\"{{titleIdService}}\" baCardClass=\"with-scroll table-panel\">\n        <ul class=\"btn-list clearfix\">\n          <li>\n            <button type=\"button\" class=\"btn btn-danger btn-raised\" (click)=\"createIdService()\">Create ID Service</button>\n          </li>\n        </ul>\n      </ba-card>\n    </div>\n\n    <div *ngIf=\"endorseMainSwitch\">\n      <endorsed-by-list [title]=\"'Organizations endorsing the Instance (' + title + ')'\" [endorsements]=\"endorsements\" [isLoading]=\"isLoadingEndorsements\"></endorsed-by-list>\n    </div>\n  </div>\n</div>\n<mc-modal (onCancel)=\"cancelModal()\" (onOk)=\"deleteForSure()\" [show]=\"showModal\" [title]=\"'Delete instance'\" [description]=\"modalDescription\" [cancelClass]=\"'btn btn-default btn-raised'\" [cancelTitle]=\"'Cancel'\" [okClass]=\"'btn btn-danger btn-raised'\" [okTitle]=\"'Delete'\"></mc-modal>\n"

/***/ },

/***/ "./src/app/pages/org-service-registry/instances/components/instance-list/instance-list.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var organizations_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/organizations.service.ts");
var mc_notifications_service_1 = __webpack_require__("./src/app/shared/mc-notifications.service.ts");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var instances_service_1 = __webpack_require__("./src/app/backend-api/service-registry/services/instances.service.ts");
var sr_search_requests_service_1 = __webpack_require__("./src/app/pages/org-service-registry/shared/services/sr-search-requests.service.ts");
var SEARCH_KEY = 'InstanceListComponent';
var InstanceListComponent = (function () {
    function InstanceListComponent(searchRequestsService, route, router, notifications, orgService, instancesService) {
        this.searchRequestsService = searchRequestsService;
        this.route = route;
        this.router = router;
        this.notifications = notifications;
        this.orgService = orgService;
        this.instancesService = instancesService;
        this.searchKey = SEARCH_KEY;
        this.isSearching = false;
    }
    InstanceListComponent.prototype.ngOnInit = function () {
        this.cardTitle = 'Instances';
        this.onGotoInstance = this.gotoInstance.bind(this);
        this.isLoading = true;
        this.loadMyOrganization();
        this.loadInstances();
    };
    InstanceListComponent.prototype.search = function (searchRequest) {
        this.isSearching = true;
        this.searchInstances(searchRequest);
    };
    InstanceListComponent.prototype.searchInstances = function (searchRequest) {
        var _this = this;
        this.instancesService.searchInstances(searchRequest).subscribe(function (instances) {
            _this.instances = instances;
            _this.isSearching = false;
            _this.isLoading = false;
            _this.initialSearchRequest = searchRequest;
        }, function (err) {
            _this.searchRequestsService.addSearchRequest(SEARCH_KEY, _this.initialSearchRequest);
            _this.isSearching = false;
            _this.isLoading = false;
            _this.notifications.generateNotification('Error', 'Error when trying to search instances', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    InstanceListComponent.prototype.loadInstances = function () {
        var _this = this;
        var searchRequest = this.searchRequestsService.getSearchRequest(SEARCH_KEY);
        this.initialSearchRequest = searchRequest;
        if (searchRequest) {
            this.searchInstances(searchRequest);
        }
        else {
            this.instancesService.getInstancesForMyOrg().subscribe(function (instances) {
                _this.instances = instances;
                _this.isLoading = false;
            }, function (err) {
                _this.isLoading = false;
                _this.notifications.generateNotification('Error', 'Error when trying to get instances', mc_notifications_service_1.MCNotificationType.Error, err);
            });
        }
    };
    InstanceListComponent.prototype.loadMyOrganization = function () {
        var _this = this;
        this.orgService.getMyOrganization().subscribe(function (organization) {
            _this.organization = organization;
        }, function (err) {
            _this.notifications.generateNotification('Error', 'Error when trying to get organization', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    InstanceListComponent.prototype.gotoInstance = function (index) {
        this.router.navigate([this.instances[index].instanceId], { queryParams: { instanceVersion: this.instances[index].version }, relativeTo: this.route });
    };
    InstanceListComponent = __decorate([
        core_1.Component({
            selector: 'instance-list',
            encapsulation: core_1.ViewEncapsulation.None,
            template: __webpack_require__("./src/app/pages/org-service-registry/instances/components/instance-list/instance-list.html"),
            styles: []
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof sr_search_requests_service_1.SrSearchRequestsService !== 'undefined' && sr_search_requests_service_1.SrSearchRequestsService) === 'function' && _a) || Object, (typeof (_b = typeof router_1.ActivatedRoute !== 'undefined' && router_1.ActivatedRoute) === 'function' && _b) || Object, (typeof (_c = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _c) || Object, (typeof (_d = typeof mc_notifications_service_1.MCNotificationsService !== 'undefined' && mc_notifications_service_1.MCNotificationsService) === 'function' && _d) || Object, (typeof (_e = typeof organizations_service_1.OrganizationsService !== 'undefined' && organizations_service_1.OrganizationsService) === 'function' && _e) || Object, (typeof (_f = typeof instances_service_1.InstancesService !== 'undefined' && instances_service_1.InstancesService) === 'function' && _f) || Object])
    ], InstanceListComponent);
    return InstanceListComponent;
    var _a, _b, _c, _d, _e, _f;
}());
exports.InstanceListComponent = InstanceListComponent;


/***/ },

/***/ "./src/app/pages/org-service-registry/instances/components/instance-list/instance-list.html":
/***/ function(module, exports) {

module.exports = "<div class=\"row\">\n  <div class=\"col-lg-12\">\n    <ba-card title=\"{{cardTitle}}\" baCardClass=\"with-scroll table-panel\">\n      <service-registry-search [searchTitle]=\"'Search filters'\" [searchKey]=\"searchKey\" [isSearching]=\"isSearching\" [showEndorsement]=\"true\" [preFilterMyOrg]=\"true\" (onSearch)=\"search($event)\"></service-registry-search>\n\n      <div class=\"separator\"></div>\n\n      <instances-table [instances]=\"instances\" [isLoading]=\"isLoading\" [onRowClick]=\"onGotoInstance\"></instances-table>\n    </ba-card>\n  </div>\n</div>\n"

/***/ },

/***/ "./src/app/pages/org-service-registry/instances/components/instance-new/instance-new.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var mc_notifications_service_1 = __webpack_require__("./src/app/shared/mc-notifications.service.ts");
var organizations_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/organizations.service.ts");
var mcFileUploader_component_1 = __webpack_require__("./src/app/theme/components/mcFileUploader/mcFileUploader.component.ts");
var navigation_helper_service_1 = __webpack_require__("./src/app/shared/navigation-helper.service.ts");
var xml_parser_service_1 = __webpack_require__("./src/app/shared/xml-parser.service.ts");
var designs_service_1 = __webpack_require__("./src/app/backend-api/service-registry/services/designs.service.ts");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var sr_view_model_service_1 = __webpack_require__("./src/app/pages/org-service-registry/shared/services/sr-view-model.service.ts");
var instances_service_1 = __webpack_require__("./src/app/backend-api/service-registry/services/instances.service.ts");
var id_services_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/id-services.service.ts");
var instance_xml_parser_service_1 = __webpack_require__("./src/app/pages/org-service-registry/shared/services/instance-xml-parser.service.ts");
var mrn_helper_service_1 = __webpack_require__("./src/app/shared/mrn-helper.service.ts");
var mcFormControlModel_1 = __webpack_require__("./src/app/theme/components/mcForm/mcFormControlModel.ts");
var forms_1 = __webpack_require__("./node_modules/@angular/forms/index.js");
var ServiceViewModel_1 = __webpack_require__("./src/app/pages/org-identity-registry/services/view-models/ServiceViewModel.ts");
var Service_1 = __webpack_require__("./src/app/backend-api/identity-registry/autogen/model/Service.ts");
var select_validator_1 = __webpack_require__("./src/app/theme/validators/select.validator.ts");
var vessels_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/vessels.service.ts");
var vessel_helper_1 = __webpack_require__("./src/app/pages/shared/services/vessel-helper.ts");
var OidcAccessTypeEnum = Service_1.Service.OidcAccessTypeEnum;
var InstanceNewComponent = (function () {
    function InstanceNewComponent(formBuilder, xmlParser, mrnHelper, activatedRoute, xmlParserService, viewModelService, navigationService, notifications, designsService, orgService, instancesService, idServicesService, vesselsService) {
        this.formBuilder = formBuilder;
        this.xmlParser = xmlParser;
        this.mrnHelper = mrnHelper;
        this.activatedRoute = activatedRoute;
        this.xmlParserService = xmlParserService;
        this.viewModelService = viewModelService;
        this.navigationService = navigationService;
        this.notifications = notifications;
        this.designsService = designsService;
        this.orgService = orgService;
        this.instancesService = instancesService;
        this.idServicesService = idServicesService;
        this.vesselsService = vesselsService;
        this.hasError = false;
        this.captionXml = 'Upload Instance XML file';
        this.captionDoc = 'Upload Instance Document file';
        this.fileTypeXml = mcFileUploader_component_1.FileUploadType.Xml;
        this.fileTypeDoc = mcFileUploader_component_1.FileUploadType.Doc;
        this.requiredTextXml = 'You need to upload XML file';
        this.requiredTextDoc = 'You need to upload a DOCX, ODT or PDF file';
        this.isLoading = true;
        this.isRegistering = false;
        this.registerTitle = "Register Instance";
        this.registerButtonClass = "btn btn-danger btn-raised";
        this.oidcAccessType = null;
        this.useOIDC = false;
        this.useOIDCRedirect = true;
        this.linkToVessel = false;
        this.showModal = false;
    }
    InstanceNewComponent.prototype.ngOnInit = function () {
        this.onRegister = this.register.bind(this);
        this.isRegistering = false;
        this.isLoading = true;
        this.loadVessels();
        this.generateForm();
        this.loadMyOrganization();
        this.loadDesign();
        this.updateUI();
    };
    InstanceNewComponent.prototype.isFormValid = function () {
        var oidcTypeValid = true;
        var oidcAccessType = this.registerForm.value.oidcAccessType;
        if (this.useOIDC && (!oidcAccessType || oidcAccessType.toLowerCase().indexOf('undefined') >= 0)) {
            oidcTypeValid = false;
        }
        return this.xml != null && this.registerForm.valid && oidcTypeValid;
    };
    InstanceNewComponent.prototype.onUploadDoc = function (file) {
        this.doc = file;
    };
    InstanceNewComponent.prototype.onUploadXml = function (file) {
        if (file && this.isXmlValid(file)) {
            this.xml = file;
            try {
                var urlString = this.xmlParser.getEndpoint(file);
                var url = new URL(urlString);
                this.registerForm.patchValue({ certDomainName: url.hostname });
            }
            catch (e) {
            }
        }
        else {
            this.resetXmlFile();
        }
        this.updateUI();
    };
    InstanceNewComponent.prototype.isXmlValid = function (file) {
        try {
            var mrn = this.xmlParser.getMrn(file);
            var isValid = this.mrnHelper.checkMrnForInstance(mrn);
            if (isValid) {
                var designMrn = this.xmlParser.getMrnForDesignInInstance(file);
                var designVersion = this.xmlParser.getVersionForDesignInInstance(file);
                isValid = (designMrn === this.design.designId) && (designVersion === this.design.version);
                if (!isValid) {
                    this.errorText = "The MRN and/or version referencing the Design in the XML, doesn't match the MRN and/or version of the chosen Design.<BR><BR>"
                        + "Chosen Design: " + this.design.designId + ", version: " + this.design.version + "<BR>"
                        + "Xml-parsed Design: " + designMrn + ", version: " + designVersion + "<BR>";
                }
                var isWKTValid = void 0;
                try {
                    isWKTValid = this.isWKTValid(file);
                    if (!isWKTValid) {
                        var errorText = "The WKT(s) for the coverage area(s) of the instance XML is invalid. This can be due to "
                            + "invalid characters and/or unnecessary whitespaces.<BR>";
                        this.errorText ? this.errorText += errorText : this.errorText = errorText;
                        isValid = false;
                    }
                }
                catch (error) {
                    var errorText = "The WKTs for the coverage areas cannot be read. This can be due to "
                        + "them being missing or being invalid.<BR>";
                    this.errorText ? this.errorText += errorText : this.errorText = errorText;
                    isValid = false;
                }
            }
            else {
                this.errorText = "The ID in the XML-file is wrong. The ID is supposed to be an MRN in the following format:<BR>"
                    + this.mrnHelper.mrnMaskTextForInstance() + "'ID'<BR>"
                    + "'ID'=" + this.mrnHelper.mrnPatternError();
            }
            this.hasError = !isValid;
            return isValid;
        }
        catch (error) {
            this.notifications.generateNotification('Error in XML', error.message, mc_notifications_service_1.MCNotificationType.Error, error);
            return false;
        }
    };
    InstanceNewComponent.prototype.isWKTValid = function (file) {
        var parser = new DOMParser();
        var xmlString = file.content.split('\+').join(''); // remove +
        var xmlData = parser.parseFromString(xmlString, file.contentContentType);
        var coversAreasRootElement = xmlData.getElementsByTagName('coversAreas');
        if (coversAreasRootElement.length == 0) {
            var prefix = xmlData.documentElement.prefix;
            coversAreasRootElement = xmlData.getElementsByTagName(prefix + ":" + 'coversAreas');
        }
        var coversAreasRoot = coversAreasRootElement[0];
        var coversAreasElement = coversAreasRoot.getElementsByTagName('coversArea');
        if (coversAreasElement.length == 0) {
            var prefix = xmlData.documentElement.prefix;
            coversAreasElement = coversAreasRoot.getElementsByTagName(prefix + ":" + 'coversArea');
        }
        // no coversArea? Then probably using unlocodes, thus we don't show map
        if (!coversAreasElement || coversAreasElement.length == 0) {
            this.WKTs = null;
            return true;
        }
        var coversAreas = coversAreasElement;
        var isValid = true;
        var areas = [];
        for (var i = 0; i < coversAreas.length; i++) {
            var nodeElement = coversAreasRoot.getElementsByTagName('geometryAsWKT');
            if (nodeElement.length == 0) {
                var prefix = xmlData.documentElement.prefix;
                nodeElement = coversAreas[i].getElementsByTagName(prefix + ":" + 'geometryAsWKT');
            }
            var area = null;
            if (nodeElement && nodeElement[0]) {
                var node = nodeElement[0].childNodes[0];
                if (node) {
                    area = node.nodeValue.replace(/\s+\(\(/, '\(\(');
                }
                else {
                    area = 'POLYGON((-180 90, 180 90, 180 -90, -180 -90))';
                }
            }
            else {
                area = 'POLYGON((-180 90, 180 90, 180 -90, -180 -90))';
            }
            if (area.includes('\+')) {
                return false;
            }
            else {
                areas.push(area);
            }
        }
        if (isValid) {
            this.WKTs = areas;
        }
        return isValid;
    };
    InstanceNewComponent.prototype.resetXmlFile = function () {
        this.xml = null;
        this.WKTs = null;
        this.fileUploadXml.resetFileSelection();
    };
    InstanceNewComponent.prototype.updateUI = function () {
        if (this.xml) {
            this.parseInstance();
        }
        else {
            this.parsedInstance = null;
            this.setupLableValuesParsed();
        }
    };
    InstanceNewComponent.prototype.parseInstance = function () {
        this.parsedInstance = null;
        try {
            var instance = {};
            instance.instanceAsXml = this.xml;
            instance.name = this.xmlParser.getName(this.xml);
            instance.description = this.xmlParser.getDescription(this.xml);
            instance.instanceId = this.xmlParser.getMrn(this.xml);
            instance.keywords = this.xmlParser.getKeywords(this.xml);
            instance.status = this.xmlParser.getStatus(this.xml);
            instance.organizationId = this.organization.mrn;
            instance.version = this.xmlParser.getVersion(this.xml);
            instance.endpointUri = this.xmlParser.getEndpoint(this.xml);
            instance.designId = this.design.designId;
            this.parsedInstance = instance;
        }
        catch (error) {
            this.isRegistering = false;
            this.resetXmlFile();
            this.notifications.generateNotification('Error in XML', error.message, mc_notifications_service_1.MCNotificationType.Error, error);
        }
        finally {
            this.setupLableValuesParsed();
        }
    };
    InstanceNewComponent.prototype.setupLableValuesParsed = function () {
        this.labelValuesParsed = [];
        this.labelValuesParsed.push({ label: 'Upload XML', valueHtml: '' });
        if (this.organization && this.parsedInstance) {
            this.labelValuesParsed = this.viewModelService.generateLabelValuesForInstance(this.parsedInstance, this.organization.name);
        }
    };
    InstanceNewComponent.prototype.cancel = function () {
        this.navigationService.cancelCreateInstance();
    };
    InstanceNewComponent.prototype.register = function () {
        if (this.showVesselAttNotEqualWarning()) {
            var imoNumber = this.xmlParser.getImo(this.parsedInstance.instanceAsXml);
            var mmsiNumber = this.xmlParser.getMmsi(this.parsedInstance.instanceAsXml);
            this.modalDescription =
                "The IMO and/or the MMSI number from the Xml and the Vessel doesn't match.<br><br>" +
                    "Vessel: IMO:" + vessel_helper_1.VesselHelper.getIMO(this.vessel) + ", MMSI:" + vessel_helper_1.VesselHelper.getMMSI(this.vessel) + "<br>" +
                    "Xml: IMO:" + imoNumber + ", MMSI:" + mmsiNumber + "<br><br>" +
                    "Register Instance anyway?";
            this.showModal = true;
        }
        else {
            this.registerForSure();
        }
    };
    InstanceNewComponent.prototype.showVesselAttNotEqualWarning = function () {
        if (this.linkToVessel) {
            var imoNumber = this.xmlParser.getImo(this.parsedInstance.instanceAsXml);
            var mmsiNumber = this.xmlParser.getMmsi(this.parsedInstance.instanceAsXml);
            if (!vessel_helper_1.VesselHelper.isVesselAttEqualTo(this.vessel, imoNumber, mmsiNumber)) {
                return true;
            }
        }
        return false;
    };
    InstanceNewComponent.prototype.cancelModal = function () {
        this.showModal = false;
    };
    InstanceNewComponent.prototype.registerForSure = function () {
        this.isRegistering = true;
        this.showModal = false;
        this.createInstance(this.parsedInstance);
    };
    InstanceNewComponent.prototype.createInstance = function (instance) {
        var _this = this;
        this.instancesService.createInstance(instance, this.doc).subscribe(function (instanceCreated) {
            _this.registerIdService(instanceCreated);
        }, function (err) {
            _this.isRegistering = false;
            _this.notifications.generateNotification('Error', 'Error when trying to create instance', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    InstanceNewComponent.prototype.registerIdService = function (instance) {
        var service = {
            mrn: instance.instanceId,
            name: instance.name,
            instanceVersion: instance.version,
            permissions: this.registerForm.value.permissions,
            certDomainName: this.registerForm.value.certDomainName
        };
        if (this.useOIDC) {
            if (this.useOIDCRedirect) {
                service.oidcRedirectUri = this.registerForm.value.oidcRedirectUri;
            }
            else {
                service.oidcRedirectUri = '';
            }
            var oidcAccessType = this.registerForm.value.oidcAccessType;
            if (oidcAccessType && oidcAccessType.toLowerCase().indexOf('undefined') < 0) {
                service.oidcAccessType = oidcAccessType;
            }
        }
        if (this.linkToVessel) {
            service.vessel = this.vessel;
        }
        this.createIdService(service, instance);
    };
    InstanceNewComponent.prototype.createIdService = function (idService, instance) {
        var _this = this;
        this.idServicesService.createIdService(idService).subscribe(function (service) {
            _this.isRegistering = false;
            _this.navigationService.navigateToOrgInstance(instance.instanceId, instance.version);
        }, function (err) {
            _this.isRegistering = false;
            _this.notifications.generateNotification('Error', 'Error when trying to create service instance in Identity Registry', mc_notifications_service_1.MCNotificationType.Error, err);
            _this.navigationService.navigateToOrgInstance(instance.instanceId, instance.version);
        });
    };
    InstanceNewComponent.prototype.loadVessels = function () {
        var _this = this;
        this.vesselsService.getVessels().subscribe(function (pageVessel) {
            _this.vessels = pageVessel.content;
            _this.generateForm();
            _this.isLoading = false;
        }, function (error) {
            _this.notifications.generateNotification('Error', 'Error when trying to get vessels for the service', mc_notifications_service_1.MCNotificationType.Error, error);
            _this.cancel();
        });
    };
    InstanceNewComponent.prototype.loadMyOrganization = function () {
        var _this = this;
        this.orgService.getMyOrganization().subscribe(function (organization) {
            _this.organization = organization;
        }, function (err) {
            _this.notifications.generateNotification('Error', 'Error when trying to get organization', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    InstanceNewComponent.prototype.loadDesign = function () {
        var _this = this;
        var designId = this.activatedRoute.snapshot.queryParams['designId'];
        var version = this.activatedRoute.snapshot.queryParams['designVersion'];
        this.designsService.getDesign(designId, version).subscribe(function (design) {
            _this.design = design;
            _this.loadOrganizationName();
        }, function (err) {
            _this.isLoading = false;
            _this.notifications.generateNotification('Error', 'Error when trying to get design', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    InstanceNewComponent.prototype.loadOrganizationName = function () {
        var _this = this;
        this.orgService.getOrganizationName(this.design.organizationId).subscribe(function (organizationName) {
            _this.labelValuesDesign = _this.viewModelService.generateLabelValuesForDesign(_this.design, organizationName);
            _this.isLoading = false;
        }, function (err) {
            _this.labelValuesDesign = _this.viewModelService.generateLabelValuesForDesign(_this.design, '');
            _this.isLoading = false;
            _this.notifications.generateNotification('Error', 'Error when trying to get organization', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    InstanceNewComponent.prototype.shouldUseOIDCRedirect = function (value) {
        if (value && this.oidcAccessType != value) {
            this.oidcAccessType = value;
            this.useOIDCRedirect = value != OidcAccessTypeEnum.BearerOnly;
            this.generateForm();
        }
    };
    InstanceNewComponent.prototype.shouldUseOIDC = function (useOIDC) {
        this.useOIDC = useOIDC;
        this.generateForm();
    };
    InstanceNewComponent.prototype.shouldLinkToVessel = function (linkToVessel) {
        this.linkToVessel = linkToVessel;
        this.generateForm();
    };
    InstanceNewComponent.prototype.generateForm = function () {
        var _this = this;
        var oldForm = this.registerForm;
        this.registerForm = this.formBuilder.group({});
        if (!oldForm) {
            oldForm = this.registerForm;
        }
        this.formControlModels = [];
        var formControlModel = { formGroup: this.registerForm, elementId: 'permissions', controlType: mcFormControlModel_1.McFormControlType.Text, labelName: 'Permissions', placeholder: '' };
        var formControl = new forms_1.FormControl(oldForm.value.permissions, formControlModel.validator);
        this.registerForm.addControl(formControlModel.elementId, formControl);
        this.formControlModels.push(formControlModel);
        formControlModel = { formGroup: this.registerForm, elementId: 'certDomainName', controlType: mcFormControlModel_1.McFormControlType.Text, labelName: 'Certificate domain name', placeholder: '' };
        formControl = new forms_1.FormControl(oldForm.value.certDomainName, formControlModel.validator);
        this.registerForm.addControl(formControlModel.elementId, formControl);
        this.formControlModels.push(formControlModel);
        var formControlModelCheckbox = { state: this.useOIDC, formGroup: this.registerForm, elementId: 'useOIDC', controlType: mcFormControlModel_1.McFormControlType.Checkbox, labelName: 'Use OpenID Connect (OIDC)' };
        formControl = new forms_1.FormControl({ value: formControlModelCheckbox.state, disabled: false }, formControlModelCheckbox.validator);
        formControl.valueChanges.subscribe(function (param) { return _this.shouldUseOIDC(param); });
        this.registerForm.addControl(formControlModelCheckbox.elementId, formControl);
        this.formControlModels.push(formControlModelCheckbox);
        if (this.useOIDC) {
            var selectValues = this.selectValues();
            var formControlModelSelect = { selectValues: selectValues, formGroup: this.registerForm, elementId: 'oidcAccessType', controlType: mcFormControlModel_1.McFormControlType.Select, labelName: 'Access type', placeholder: '', validator: select_validator_1.SelectValidator.validate, showCheckmark: true };
            formControl = new forms_1.FormControl(this.selectedValue(selectValues), formControlModelSelect.validator);
            formControl.valueChanges.subscribe(function (param) { return _this.shouldUseOIDCRedirect(param); });
            this.registerForm.addControl(formControlModelSelect.elementId, formControl);
            this.formControlModels.push(formControlModelSelect);
            if (this.useOIDCRedirect) {
                formControlModel = { formGroup: this.registerForm, elementId: 'oidcRedirectUri', controlType: mcFormControlModel_1.McFormControlType.Text, labelName: 'OIDC Redirect URI', placeholder: '', validator: forms_1.Validators.required, errorText: 'URI is required' };
                formControl = new forms_1.FormControl(oldForm.value.oidcRedirectUri, formControlModel.validator);
                this.registerForm.addControl(formControlModel.elementId, formControl);
                this.formControlModels.push(formControlModel);
            }
        }
        var linkToVesselCheckbox = { state: this.linkToVessel, formGroup: this.registerForm, elementId: 'linkToVessel', controlType: mcFormControlModel_1.McFormControlType.Checkbox, labelName: 'Link to a vessel' };
        formControl = new forms_1.FormControl({ value: linkToVesselCheckbox.state, disabled: false }, linkToVesselCheckbox.validator);
        formControl.valueChanges.subscribe(function (param) { return _this.shouldLinkToVessel(param); });
        this.registerForm.addControl(linkToVesselCheckbox.elementId, formControl);
        this.formControlModels.push(linkToVesselCheckbox);
        if (this.linkToVessel) {
            var selectValues = this.vesselSelectValues();
            var vesselSelect = { selectValues: selectValues, formGroup: this.registerForm, elementId: 'vesselSelect', controlType: mcFormControlModel_1.McFormControlType.Select, validator: null, labelName: 'Vessel', placeholder: '', showCheckmark: false, requireGroupValid: false };
            formControl = new forms_1.FormControl(this.selectedValue(selectValues), vesselSelect.validator);
            formControl.valueChanges.subscribe(function (param) {
                if (param) {
                    _this.vessel = param;
                }
            });
            this.registerForm.addControl(vesselSelect.elementId, formControl);
            this.formControlModels.push(vesselSelect);
        }
    };
    InstanceNewComponent.prototype.selectValues = function () {
        var _this = this;
        var selectValues = [];
        selectValues.push({ value: undefined, label: 'Choose access type...', isSelected: this.oidcAccessType == null });
        var allOidcTypes = ServiceViewModel_1.ServiceViewModel.getAllOidcAccessTypes();
        allOidcTypes.forEach(function (oidcType) {
            var isSelected = OidcAccessTypeEnum[oidcType.value] === OidcAccessTypeEnum[_this.oidcAccessType];
            selectValues.push({ value: oidcType.value, label: oidcType.label, isSelected: isSelected });
        });
        return selectValues;
    };
    InstanceNewComponent.prototype.vesselSelectValues = function () {
        var _this = this;
        var selectValues = [];
        var defaultSelected = true;
        if (this.vessels && this.vessels.length > 0) {
            this.vessels.forEach(function (vessel) {
                var isSelected = false;
                if (_this.vessel) {
                    isSelected = _this.vessel.mrn === vessel.mrn;
                }
                else {
                    isSelected = defaultSelected;
                    defaultSelected = false;
                }
                selectValues.push({ value: vessel, label: vessel_helper_1.VesselHelper.labelForSelect(vessel), isSelected: isSelected });
            });
        }
        return selectValues;
    };
    InstanceNewComponent.prototype.selectedValue = function (selectValues) {
        for (var _i = 0, selectValues_1 = selectValues; _i < selectValues_1.length; _i++) {
            var selectModel = selectValues_1[_i];
            if (selectModel.isSelected) {
                return selectModel.value;
            }
        }
        return '';
    };
    __decorate([
        core_1.ViewChild('uploadXml'), 
        __metadata('design:type', (typeof (_a = typeof mcFileUploader_component_1.McFileUploader !== 'undefined' && mcFileUploader_component_1.McFileUploader) === 'function' && _a) || Object)
    ], InstanceNewComponent.prototype, "fileUploadXml", void 0);
    InstanceNewComponent = __decorate([
        core_1.Component({
            selector: 'instance-new',
            encapsulation: core_1.ViewEncapsulation.None,
            template: __webpack_require__("./src/app/pages/org-service-registry/instances/components/instance-new/instance-new.html"),
            styles: []
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof forms_1.FormBuilder !== 'undefined' && forms_1.FormBuilder) === 'function' && _b) || Object, (typeof (_c = typeof instance_xml_parser_service_1.InstanceXmlParser !== 'undefined' && instance_xml_parser_service_1.InstanceXmlParser) === 'function' && _c) || Object, (typeof (_d = typeof mrn_helper_service_1.MrnHelperService !== 'undefined' && mrn_helper_service_1.MrnHelperService) === 'function' && _d) || Object, (typeof (_e = typeof router_1.ActivatedRoute !== 'undefined' && router_1.ActivatedRoute) === 'function' && _e) || Object, (typeof (_f = typeof xml_parser_service_1.XmlParserService !== 'undefined' && xml_parser_service_1.XmlParserService) === 'function' && _f) || Object, (typeof (_g = typeof sr_view_model_service_1.SrViewModelService !== 'undefined' && sr_view_model_service_1.SrViewModelService) === 'function' && _g) || Object, (typeof (_h = typeof navigation_helper_service_1.NavigationHelperService !== 'undefined' && navigation_helper_service_1.NavigationHelperService) === 'function' && _h) || Object, (typeof (_j = typeof mc_notifications_service_1.MCNotificationsService !== 'undefined' && mc_notifications_service_1.MCNotificationsService) === 'function' && _j) || Object, (typeof (_k = typeof designs_service_1.DesignsService !== 'undefined' && designs_service_1.DesignsService) === 'function' && _k) || Object, (typeof (_l = typeof organizations_service_1.OrganizationsService !== 'undefined' && organizations_service_1.OrganizationsService) === 'function' && _l) || Object, (typeof (_m = typeof instances_service_1.InstancesService !== 'undefined' && instances_service_1.InstancesService) === 'function' && _m) || Object, (typeof (_o = typeof id_services_service_1.IdServicesService !== 'undefined' && id_services_service_1.IdServicesService) === 'function' && _o) || Object, (typeof (_p = typeof vessels_service_1.VesselsService !== 'undefined' && vessels_service_1.VesselsService) === 'function' && _p) || Object])
    ], InstanceNewComponent);
    return InstanceNewComponent;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
}());
exports.InstanceNewComponent = InstanceNewComponent;


/***/ },

/***/ "./src/app/pages/org-service-registry/instances/components/instance-new/instance-new.html":
/***/ function(module, exports) {

module.exports = "<div class=\"row\">\n  <div class=\"col-lg-12\">\n    <ba-card title=\"Register new Instance for {{organization?.name}}\" baCardClass=\"with-scroll table-panel\">\n      <h5 *ngIf=\"design\">Registering an instance for this design</h5>\n      <mc-label-value-table [isLoading]=\"isLoading\" [labelValues]=\"labelValuesDesign\"></mc-label-value-table>\n\n      <div class=\"separator\"></div>\n\n      <div *ngIf=\"design\">\n        <form>\n          <mc-file-uploader #uploadXml [caption]=\"captionXml\" [fileUploadType]=\"fileTypeXml\" [requiredText]=\"requiredTextXml\" (onUpload)=\"onUploadXml($event)\"></mc-file-uploader>\n          <mc-file-uploader [caption]=\"captionDoc\" [fileUploadType]=\"fileTypeDoc\" [requiredText]=\"requiredTextDoc\" (onUpload)=\"onUploadDoc($event)\"></mc-file-uploader>\n          <div *ngIf=\"hasError\" class=\"error-notice\" [innerHTML]=\"errorText | undefined | sanitizeHtml\"></div>\n\n          <mc-form [hideButtons]=\"true\" [formGroup]=\"registerForm\" [formControlModels]=\"formControlModels\" [isLoading]=\"isLoading\"></mc-form>\n\n          <ul class=\"btn-list clearfix\">\n            <li>\n              <mc-loading-button [class]=\"registerButtonClass\" [disabled]=\"!isFormValid()\" [isLoading]=\"isRegistering\" [title]=\"registerTitle\" [onClick]=\"onRegister\" ></mc-loading-button>\n            </li>\n            <li>\n              <button type=\"button\" class=\"btn btn-default btn-raised\" (click)=\"cancel()\">Cancel</button>\n            </li>\n          </ul>\n        </form>\n        <div class=\"separator\"></div>\n\n        <mc-label-value-table [isLoading]=\"false\" [labelValues]=\"labelValuesParsed\"></mc-label-value-table>\n        <mc-coverage-map *ngIf=\"WKTs\" [isLoading]=\"isLoading\" [hideButton]=\"true\" [WKTs]=\"WKTs\"></mc-coverage-map>\n      </div>\n      <div class=\"no-data\" *ngIf=\"!design && !isLoading\">No data</div>\n    </ba-card>\n  </div>\n</div>\n<mc-modal (onCancel)=\"cancelModal()\" (onOk)=\"registerForSure()\" [show]=\"showModal\" [title]=\"'Register instance'\" [description]=\"modalDescription\" [cancelClass]=\"'btn btn-default btn-raised'\" [cancelTitle]=\"'Cancel'\" [okClass]=\"'btn btn-danger btn-raised'\" [okTitle]=\"'Register'\"></mc-modal>\n"

/***/ },

/***/ "./src/app/pages/org-service-registry/instances/components/instance-update/instance-update.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var mc_notifications_service_1 = __webpack_require__("./src/app/shared/mc-notifications.service.ts");
var mcFileUploader_component_1 = __webpack_require__("./src/app/theme/components/mcFileUploader/mcFileUploader.component.ts");
var navigation_helper_service_1 = __webpack_require__("./src/app/shared/navigation-helper.service.ts");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var instances_service_1 = __webpack_require__("./src/app/backend-api/service-registry/services/instances.service.ts");
var instance_xml_parser_service_1 = __webpack_require__("./src/app/pages/org-service-registry/shared/services/instance-xml-parser.service.ts");
var mrn_helper_service_1 = __webpack_require__("./src/app/shared/mrn-helper.service.ts");
var mcFormControlModel_1 = __webpack_require__("./src/app/theme/components/mcForm/mcFormControlModel.ts");
var forms_1 = __webpack_require__("./node_modules/@angular/forms/index.js");
var rxjs_1 = __webpack_require__("./node_modules/rxjs/Rx.js");
var designs_service_1 = __webpack_require__("./src/app/backend-api/service-registry/services/designs.service.ts");
var sr_view_model_service_1 = __webpack_require__("./src/app/pages/org-service-registry/shared/services/sr-view-model.service.ts");
var organizations_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/organizations.service.ts");
var InstanceUpdateComponent = (function () {
    function InstanceUpdateComponent(orgsService, viewModelService, formBuilder, xmlParser, mrnHelper, router, activatedRoute, navigationService, notifications, instancesService, designService) {
        this.orgsService = orgsService;
        this.viewModelService = viewModelService;
        this.formBuilder = formBuilder;
        this.xmlParser = xmlParser;
        this.mrnHelper = mrnHelper;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.navigationService = navigationService;
        this.notifications = notifications;
        this.instancesService = instancesService;
        this.designService = designService;
        this.hasError = false;
        this.captionXml = 'Upload Instance XML file';
        this.captionDoc = 'Upload Instance Document file';
        this.fileTypeXml = mcFileUploader_component_1.FileUploadType.Xml;
        this.fileTypeDoc = mcFileUploader_component_1.FileUploadType.Doc;
        this.isLoading = true;
        this.isUpdating = false;
        this.updateTitle = "Update Instance";
        this.isFormChanged = false;
        this.status = '';
    }
    InstanceUpdateComponent.prototype.ngOnInit = function () {
        this.isUpdating = false;
        this.isLoading = true;
        this.loadInstance();
        this.updateUI();
    };
    InstanceUpdateComponent.prototype.setFormChanged = function () {
        var changed = false;
        if (this.xml || this.doc) {
            changed = true;
        }
        else if (this.status != this.instance.status) {
            changed = true;
        }
        this.isFormChanged = changed;
    };
    InstanceUpdateComponent.prototype.onUploadDoc = function (file) {
        this.doc = file;
        this.hasError = false;
        this.setFormChanged();
        this.generateForm();
    };
    InstanceUpdateComponent.prototype.onUploadXml = function (file) {
        var _this = this;
        this.hasError = false;
        if (file) {
            this.isXmlValid(file).subscribe(function (isValid) {
                _this.hasError = !isValid;
                if (isValid) {
                    _this.xml = file;
                }
                else {
                    _this.resetXmlFile();
                }
                _this.setFormChanged();
                _this.generateForm();
                _this.updateUI();
            });
        }
        else {
            this.hasError = false;
            this.resetXmlFile();
            this.generateForm();
            this.updateUI();
        }
    };
    InstanceUpdateComponent.prototype.resetXmlFile = function () {
        this.status = this.instance.status;
        this.xml = null;
        this.fileUploadXml.resetFileSelection();
        this.setFormChanged();
        this.updateUI();
    };
    InstanceUpdateComponent.prototype.updateUI = function () {
        if (this.xml) {
            this.parseInstance();
        }
        else {
            this.parsedInstance = null;
            this.setupLableValuesParsed();
        }
    };
    InstanceUpdateComponent.prototype.isXmlValid = function (file) {
        var _this = this;
        try {
            var designMrn_1 = this.xmlParser.getMrnForDesignInInstance(file);
            var designVersion_1 = this.xmlParser.getVersionForDesignInInstance(file);
            var isDesignTheSame = this.isDesignSameAsBefore(designMrn_1, designVersion_1);
            if (isDesignTheSame) {
                var parseValid = this.parseDisplayValues(file);
                return rxjs_1.Observable.of(parseValid);
            }
            else {
                return rxjs_1.Observable.create(function (observer) {
                    _this.designService.getDesign(designMrn_1, designVersion_1).subscribe(function (design) {
                        var parseValid = _this.parseDisplayValues(file);
                        observer.next(parseValid);
                    }, function (err) {
                        if (err.status == 404) {
                            _this.errorText = "The MRN and version referencing the Design in the XML, doesn't match any designs in Service Registry<BR><BR>"
                                + "Xml-parsed Design: " + designMrn_1 + ", version: " + designVersion_1 + "<BR>";
                        }
                        else {
                            _this.errorText = "Error when trying to validate implemented design.<BR>";
                            // If error isn't "Not found" then another error occured and we can't proceed
                            _this.notifications.generateNotification('Error when trying to validate implemented design: ', err.message, mc_notifications_service_1.MCNotificationType.Error, err);
                        }
                        observer.next(false);
                    });
                });
            }
        }
        catch (error) {
            this.errorText = "Error in XML.<BR>";
            this.notifications.generateNotification('Error in XML', error.message, mc_notifications_service_1.MCNotificationType.Error, error);
            return rxjs_1.Observable.of(false);
        }
    };
    InstanceUpdateComponent.prototype.parseInstance = function () {
        this.parsedInstance = null;
        try {
            if (this.xml) {
                var instance = _.cloneDeep(this.instance);
                // Already contains an XML, so just update the values and not the ID
                instance.instanceAsXml.content = this.xml.content;
                instance.instanceAsXml.contentContentType = this.xml.contentContentType;
                instance.instanceAsXml.name = this.xml.name;
                instance.name = this.xmlParser.getName(this.xml);
                instance.description = this.xmlParser.getDescription(this.xml);
                instance.keywords = this.xmlParser.getKeywords(this.xml);
                instance.status = this.xmlParser.getStatus(this.xml);
                instance.version = this.xmlParser.getVersion(this.xml);
                instance.endpointUri = this.xmlParser.getEndpoint(this.xml);
                instance.designId = this.xmlParser.getMrnForDesignInInstance(this.xml);
                this.parsedInstance = instance;
                this.setupLableValuesParsed();
            }
        }
        catch (error) {
            this.isUpdating = false;
            this.notifications.generateNotification('Error in XML', error.message, mc_notifications_service_1.MCNotificationType.Error, error);
            this.resetXmlFile();
        }
        finally {
            this.WKTs = this.xmlParser.getGeometriesAsWKT(this.xml);
        }
    };
    InstanceUpdateComponent.prototype.parseDisplayValues = function (file) {
        this.status = this.xmlParser.getStatus(file);
        var parsedMrn = this.xmlParser.getMrn(file);
        var parsedVersion = this.xmlParser.getVersion(file);
        if (parsedMrn != this.instance.instanceId || parsedVersion != this.instance.version) {
            this.errorText = "The MRN and Version in the XML are not the same as the MRN and Version of this Instance. If the MRN or Version needs to be changed, please create a NEW Instance instead of updating an existing.<BR><BR>"
                + "Xml-parsed MRN: " + parsedMrn + "<BR>"
                + "Xml-parsed Version: " + parsedVersion + "<BR>";
            return false;
        }
        else {
            return true;
        }
    };
    InstanceUpdateComponent.prototype.setupLableValuesParsed = function () {
        var _this = this;
        this.labelValuesParsed = [];
        this.labelValuesParsed.push({ label: 'Upload XML', valueHtml: '' });
        if (this.parsedInstance) {
            this.orgsService.getOrganizationName(this.instance.organizationId).subscribe(function (organizationName) {
                _this.labelValuesParsed = _this.viewModelService.generateLabelValuesForInstance(_this.parsedInstance, organizationName);
            }, function (err) {
                _this.labelValuesParsed = _this.viewModelService.generateLabelValuesForInstance(_this.parsedInstance, '');
                _this.notifications.generateNotification('Error', 'Error when trying to get organization', mc_notifications_service_1.MCNotificationType.Error, err);
            });
        }
    };
    InstanceUpdateComponent.prototype.isDesignSameAsBefore = function (designMrn, designVersion) {
        try {
            var designMrnFromInstance = this.xmlParser.getMrnForDesignInInstance(this.instance.instanceAsXml);
            var designVersionFromInstance = this.xmlParser.getVersionForDesignInInstance(this.instance.instanceAsXml);
            var isSameMrn = designMrnFromInstance === designMrn;
            var isSameVersion = designVersionFromInstance === designVersion;
            return isSameMrn && isSameVersion;
        }
        catch (error) {
            return false;
        }
    };
    InstanceUpdateComponent.prototype.cancel = function () {
        this.navigationService.navigateToOrgInstance(this.instanceIdFromRoute, this.versionFromRoute);
    };
    InstanceUpdateComponent.prototype.update = function () {
        this.isUpdating = true;
        if (this.xml || this.doc) {
            if (this.xml) {
                this.instance = this.parsedInstance;
            }
            if (this.doc) {
                if (this.instance.instanceAsDoc) {
                    this.instance.instanceAsDoc.filecontent = this.doc.filecontent;
                    this.instance.instanceAsDoc.filecontentContentType = this.doc.filecontentContentType;
                    this.instance.instanceAsDoc.name = this.doc.name;
                }
                else {
                    this.instance.instanceAsDoc = this.doc;
                }
            }
            this.updateInstance();
        }
        else {
            this.status = this.updateForm.value.status;
            this.updateStatus();
        }
    };
    InstanceUpdateComponent.prototype.updateStatus = function () {
        var _this = this;
        this.instancesService.updateStatus(this.instance, this.status).subscribe(function (_) {
            _this.navigationService.navigateToOrgInstance(_this.instance.instanceId, _this.instance.version);
        }, function (err) {
            _this.isUpdating = false;
            _this.notifications.generateNotification('Error', 'Error when trying to update status of instance', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    InstanceUpdateComponent.prototype.updateInstance = function () {
        var _this = this;
        var updateDoc = this.doc != null;
        var updateXml = this.xml != null;
        this.instancesService.updateInstance(this.instance, updateDoc, updateXml).subscribe(function (_) {
            _this.navigationService.navigateToOrgInstance(_this.instance.instanceId, _this.instance.version);
        }, function (err) {
            _this.isUpdating = false;
            _this.notifications.generateNotification('Error', 'Error when trying to update instance', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    InstanceUpdateComponent.prototype.loadInstance = function () {
        var _this = this;
        this.instanceIdFromRoute = this.activatedRoute.snapshot.params['id'];
        this.versionFromRoute = this.activatedRoute.snapshot.queryParams['instanceVersion'];
        this.instancesService.getInstance(this.instanceIdFromRoute, this.versionFromRoute).subscribe(function (instance) {
            _this.instance = instance;
            _this.status = _this.instance.status;
            _this.generateLabelValues();
            _this.generateForm();
            _this.isLoading = false;
        }, function (err) {
            // TODO: make this as a general component
            if (err.status == 404) {
                _this.router.navigate(['/error404'], { relativeTo: _this.activatedRoute, replaceUrl: true });
            }
            _this.isLoading = false;
            _this.notifications.generateNotification('Error', 'Error when trying to get instance', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    InstanceUpdateComponent.prototype.generateLabelValues = function () {
        this.labelValues = [];
        this.labelValues.push({ label: 'MRN', valueHtml: this.instance.instanceId });
        this.labelValues.push({ label: 'Name', valueHtml: this.instance.name });
        this.labelValues.push({ label: 'Version', valueHtml: this.instance.version });
    };
    InstanceUpdateComponent.prototype.setStatus = function (status) {
        this.status = status;
        this.setFormChanged();
    };
    InstanceUpdateComponent.prototype.generateForm = function () {
        var _this = this;
        this.updateForm = this.formBuilder.group({});
        this.formControlModels = [];
        var formControlModel;
        var disableStatus = this.xml != null || this.doc != null;
        // TODO Get dynamically from XSD
        var statusSelect = [{ label: "provisional", value: "provisional", isSelected: false }, { label: "simulated", value: "simulated", isSelected: false },
            { label: "released", value: "released", isSelected: false }, { label: "deprecated", value: "deprecated", isSelected: false },
            { label: "deleted", value: "deleted", isSelected: false }];
        statusSelect.forEach(function (status) { if (status.value === _this.status)
            status.isSelected = true; });
        if (disableStatus) {
            formControlModel = { selectValues: statusSelect, showCheckmark: false, formGroup: this.updateForm, elementId: 'status', controlType: mcFormControlModel_1.McFormControlType.Select, labelName: 'Status', placeholder: '', isDisabled: disableStatus };
        }
        else {
            formControlModel = { selectValues: statusSelect, showCheckmark: false, formGroup: this.updateForm, elementId: 'status', controlType: mcFormControlModel_1.McFormControlType.Select, labelName: 'Status', placeholder: '' };
        }
        var formControl = new forms_1.FormControl(this.status, formControlModel.validator);
        formControl.valueChanges.subscribe(function (param) { return _this.setStatus(param); });
        this.updateForm.addControl(formControlModel.elementId, formControl);
        this.formControlModels.push(formControlModel);
    };
    __decorate([
        core_1.ViewChild('uploadXml'), 
        __metadata('design:type', (typeof (_a = typeof mcFileUploader_component_1.McFileUploader !== 'undefined' && mcFileUploader_component_1.McFileUploader) === 'function' && _a) || Object)
    ], InstanceUpdateComponent.prototype, "fileUploadXml", void 0);
    InstanceUpdateComponent = __decorate([
        core_1.Component({
            selector: 'instance-update',
            encapsulation: core_1.ViewEncapsulation.None,
            template: __webpack_require__("./src/app/pages/org-service-registry/instances/components/instance-update/instance-update.html"),
            styles: []
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof organizations_service_1.OrganizationsService !== 'undefined' && organizations_service_1.OrganizationsService) === 'function' && _b) || Object, (typeof (_c = typeof sr_view_model_service_1.SrViewModelService !== 'undefined' && sr_view_model_service_1.SrViewModelService) === 'function' && _c) || Object, (typeof (_d = typeof forms_1.FormBuilder !== 'undefined' && forms_1.FormBuilder) === 'function' && _d) || Object, (typeof (_e = typeof instance_xml_parser_service_1.InstanceXmlParser !== 'undefined' && instance_xml_parser_service_1.InstanceXmlParser) === 'function' && _e) || Object, (typeof (_f = typeof mrn_helper_service_1.MrnHelperService !== 'undefined' && mrn_helper_service_1.MrnHelperService) === 'function' && _f) || Object, (typeof (_g = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _g) || Object, (typeof (_h = typeof router_1.ActivatedRoute !== 'undefined' && router_1.ActivatedRoute) === 'function' && _h) || Object, (typeof (_j = typeof navigation_helper_service_1.NavigationHelperService !== 'undefined' && navigation_helper_service_1.NavigationHelperService) === 'function' && _j) || Object, (typeof (_k = typeof mc_notifications_service_1.MCNotificationsService !== 'undefined' && mc_notifications_service_1.MCNotificationsService) === 'function' && _k) || Object, (typeof (_l = typeof instances_service_1.InstancesService !== 'undefined' && instances_service_1.InstancesService) === 'function' && _l) || Object, (typeof (_m = typeof designs_service_1.DesignsService !== 'undefined' && designs_service_1.DesignsService) === 'function' && _m) || Object])
    ], InstanceUpdateComponent);
    return InstanceUpdateComponent;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
}());
exports.InstanceUpdateComponent = InstanceUpdateComponent;


/***/ },

/***/ "./src/app/pages/org-service-registry/instances/components/instance-update/instance-update.html":
/***/ function(module, exports) {

module.exports = "<div class=\"row\">\n  <div class=\"col-lg-12\">\n    <ba-card title=\"Update Instance - {{instance?.name}}\" baCardClass=\"with-scroll table-panel\">\n      <h5>Updating Instance</h5>\n      <mc-label-value-table [isLoading]=\"isLoading\" [labelValues]=\"labelValues\"></mc-label-value-table>\n\n      <div class=\"separator\"></div>\n\n      <div *ngIf=\"instance\">\n        <div class=\"important-notice-big\">\n          If only the <span>status</span> needs to be updated, leave the <span>XML</span> and <span>Document</span> fields empty.<br>\n          <br>\n          If a new XML-file is uploaded the <span>status</span> will be parsed from the XML.\n        </div>\n        <div class=\"separator\"></div>\n        <form>\n          <mc-file-uploader #uploadXml [caption]=\"captionXml\" [fileUploadType]=\"fileTypeXml\" (onUpload)=\"onUploadXml($event)\"></mc-file-uploader>\n          <mc-file-uploader [caption]=\"captionDoc\" [fileUploadType]=\"fileTypeDoc\" (onUpload)=\"onUploadDoc($event)\"></mc-file-uploader>\n          <div *ngIf=\"hasError\" class=\"error-notice\" [innerHTML]=\"errorText | undefined | sanitizeHtml\"></div>\n          <mc-form [isFormValid]=\"isFormChanged\" [formGroup]=\"updateForm\" [formControlModels]=\"formControlModels\" [isLoading]=\"isLoading\" [isRegistering]=\"isUpdating\" [registerTitle]=\"updateTitle\" (onCancel)=\"cancel()\" (onRegister)=\"update()\"></mc-form>\n        </form>\n\n        <div class=\"separator\"></div>\n\n        <mc-label-value-table [isLoading]=\"false\" [labelValues]=\"labelValuesParsed\"></mc-label-value-table>\n        <mc-coverage-map *ngIf=\"WKTs\" [isLoading]=\"isLoading\" [hideButton]=\"true\" [WKTs]=\"WKTs\"></mc-coverage-map>\n      </div>\n      <div class=\"no-data\" *ngIf=\"!instance && !isLoading\">No data</div>\n    </ba-card>\n  </div>\n</div>\n"

/***/ },

/***/ "./src/app/pages/org-service-registry/instances/instances.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var InstancesComponent = (function () {
    function InstancesComponent() {
    }
    InstancesComponent = __decorate([
        core_1.Component({
            selector: 'instancess',
            template: "<router-outlet></router-outlet>"
        }), 
        __metadata('design:paramtypes', [])
    ], InstancesComponent);
    return InstancesComponent;
}());
exports.InstancesComponent = InstancesComponent;


/***/ },

/***/ "./src/app/pages/org-service-registry/instances/instances.module.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var common_1 = __webpack_require__("./node_modules/@angular/common/index.js");
var instances_routing_1 = __webpack_require__("./src/app/pages/org-service-registry/instances/instances.routing.ts");
var nga_module_1 = __webpack_require__("./src/app/theme/nga.module.ts");
var shared_module_1 = __webpack_require__("./src/app/pages/shared/shared.module.ts");
var instances_component_1 = __webpack_require__("./src/app/pages/org-service-registry/instances/instances.component.ts");
var instance_list_component_1 = __webpack_require__("./src/app/pages/org-service-registry/instances/components/instance-list/instance-list.component.ts");
var instance_details_component_1 = __webpack_require__("./src/app/pages/org-service-registry/instances/components/instance-details/instance-details.component.ts");
var instance_new_component_1 = __webpack_require__("./src/app/pages/org-service-registry/instances/components/instance-new/instance-new.component.ts");
var services_module_1 = __webpack_require__("./src/app/pages/org-identity-registry/services/services.module.ts");
var instance_update_component_1 = __webpack_require__("./src/app/pages/org-service-registry/instances/components/instance-update/instance-update.component.ts");
var InstancesModule = (function () {
    function InstancesModule() {
    }
    InstancesModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                nga_module_1.NgaModule,
                shared_module_1.SharedModule,
                instances_routing_1.routing,
                services_module_1.default
            ],
            declarations: [
                instances_component_1.InstancesComponent,
                instance_list_component_1.InstanceListComponent,
                instance_details_component_1.InstanceDetailsComponent,
                instance_new_component_1.InstanceNewComponent,
                instance_update_component_1.InstanceUpdateComponent
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], InstancesModule);
    return InstancesModule;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InstancesModule;


/***/ },

/***/ "./src/app/pages/org-service-registry/instances/instances.routing.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var instances_component_1 = __webpack_require__("./src/app/pages/org-service-registry/instances/instances.component.ts");
var instance_list_component_1 = __webpack_require__("./src/app/pages/org-service-registry/instances/components/instance-list/instance-list.component.ts");
var instance_details_component_1 = __webpack_require__("./src/app/pages/org-service-registry/instances/components/instance-details/instance-details.component.ts");
var instance_new_component_1 = __webpack_require__("./src/app/pages/org-service-registry/instances/components/instance-new/instance-new.component.ts");
var service_new_component_1 = __webpack_require__("./src/app/pages/org-identity-registry/services/components/service-new/service-new.component.ts");
var certificate_issue_new_component_1 = __webpack_require__("./src/app/pages/shared/components/certificate-issue-new/certificate-issue-new.component.ts");
var service_update_component_1 = __webpack_require__("./src/app/pages/org-identity-registry/services/components/service-update/service-update.component.ts");
var certificate_revoke_component_1 = __webpack_require__("./src/app/pages/shared/components/certificate-revoke/certificate-revoke.component.ts");
var instance_update_component_1 = __webpack_require__("./src/app/pages/org-service-registry/instances/components/instance-update/instance-update.component.ts");
// noinspection TypeScriptValidateTypes
exports.routes = [
    {
        path: 'instances',
        component: instances_component_1.InstancesComponent,
        data: { breadcrumb: 'Instances' },
        children: [
            {
                path: '',
                component: instance_list_component_1.InstanceListComponent
            },
            {
                path: 'issuecert',
                component: certificate_issue_new_component_1.CertificateIssueNewComponent,
                data: { breadcrumb: 'New Certificate' },
                children: []
            },
            {
                path: 'revokecert',
                component: certificate_revoke_component_1.CertificateRevokeComponent,
                data: { breadcrumb: 'Revoke Certificate' },
                children: []
            },
            {
                path: 'register',
                component: instance_new_component_1.InstanceNewComponent,
                data: { breadcrumb: 'Register' }
            },
            {
                path: 'register-id',
                component: service_new_component_1.ServiceNewComponent,
                data: { breadcrumb: 'Register ID' }
            },
            {
                path: ':id',
                component: instance_details_component_1.InstanceDetailsComponent,
                data: { breadcrumb: 'Details' }
            },
            {
                path: 'update-id/:id',
                component: service_update_component_1.ServiceUpdateComponent,
                data: { breadcrumb: 'Update ID' }
            },
            {
                path: 'update/:id',
                component: instance_update_component_1.InstanceUpdateComponent,
                data: { breadcrumb: 'Update' }
            }
        ]
    }
];
exports.routing = router_1.RouterModule.forChild(exports.routes);


/***/ },

/***/ "./src/app/pages/org-service-registry/org-service-registry.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var OrgServiceRegistryComponent = (function () {
    function OrgServiceRegistryComponent() {
    }
    OrgServiceRegistryComponent = __decorate([
        core_1.Component({
            selector: 'org-service-registry',
            template: "<router-outlet></router-outlet>"
        }), 
        __metadata('design:paramtypes', [])
    ], OrgServiceRegistryComponent);
    return OrgServiceRegistryComponent;
}());
exports.OrgServiceRegistryComponent = OrgServiceRegistryComponent;


/***/ },

/***/ "./src/app/pages/org-service-registry/org-service-registry.module.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var common_1 = __webpack_require__("./node_modules/@angular/common/index.js");
var nga_module_1 = __webpack_require__("./src/app/theme/nga.module.ts");
var org_service_registry_routing_1 = __webpack_require__("./src/app/pages/org-service-registry/org-service-registry.routing.ts");
var org_service_registry_component_1 = __webpack_require__("./src/app/pages/org-service-registry/org-service-registry.component.ts");
var specifications_module_1 = __webpack_require__("./src/app/pages/org-service-registry/specifications/specifications.module.ts");
var designs_module_1 = __webpack_require__("./src/app/pages/org-service-registry/designs/designs.module.ts");
var instances_module_1 = __webpack_require__("./src/app/pages/org-service-registry/instances/instances.module.ts");
var sr_how_to_module_1 = __webpack_require__("./src/app/pages/org-service-registry/sr-how-to/sr-how-to.module.ts");
var specification_xml_parser_service_1 = __webpack_require__("./src/app/pages/org-service-registry/shared/services/specification-xml-parser.service.ts");
var design_xml_parser_service_1 = __webpack_require__("./src/app/pages/org-service-registry/shared/services/design-xml-parser.service.ts");
var instance_xml_parser_service_1 = __webpack_require__("./src/app/pages/org-service-registry/shared/services/instance-xml-parser.service.ts");
var OrgServiceRegistryModule = (function () {
    function OrgServiceRegistryModule() {
    }
    OrgServiceRegistryModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                nga_module_1.NgaModule,
                specifications_module_1.default,
                designs_module_1.default,
                instances_module_1.default,
                sr_how_to_module_1.default,
                org_service_registry_routing_1.routing
            ],
            declarations: [
                org_service_registry_component_1.OrgServiceRegistryComponent
            ],
            providers: [
                specification_xml_parser_service_1.SpecificationXmlParser,
                design_xml_parser_service_1.DesignXmlParser,
                instance_xml_parser_service_1.InstanceXmlParser
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], OrgServiceRegistryModule);
    return OrgServiceRegistryModule;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OrgServiceRegistryModule;


/***/ },

/***/ "./src/app/pages/org-service-registry/org-service-registry.routing.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var org_service_registry_component_1 = __webpack_require__("./src/app/pages/org-service-registry/org-service-registry.component.ts");
var specifications_component_1 = __webpack_require__("./src/app/pages/org-service-registry/specifications/specifications.component.ts");
var designs_component_1 = __webpack_require__("./src/app/pages/org-service-registry/designs/designs.component.ts");
var instances_component_1 = __webpack_require__("./src/app/pages/org-service-registry/instances/instances.component.ts");
var sr_how_to_component_1 = __webpack_require__("./src/app/pages/org-service-registry/sr-how-to/sr-how-to.component.ts");
// noinspection TypeScriptValidateTypes
var routes = [
    {
        path: '',
        component: org_service_registry_component_1.OrgServiceRegistryComponent,
        children: [
            { path: 'howto', component: sr_how_to_component_1.SrHowToComponent },
            { path: 'specifications', component: specifications_component_1.SpecificationsComponent },
            { path: 'designs', component: designs_component_1.DesignsComponent },
            { path: 'instances', component: instances_component_1.InstancesComponent }
        ]
    }
];
exports.routing = router_1.RouterModule.forChild(routes);


/***/ },

/***/ "./src/app/pages/org-service-registry/shared/services/sr-search-requests.service.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var SrSearchRequestsService = (function () {
    function SrSearchRequestsService() {
        this.searchRequests = {};
    }
    // Returns null if none found
    SrSearchRequestsService.prototype.getSearchRequest = function (key) {
        return this.searchRequests[key];
    };
    SrSearchRequestsService.prototype.addSearchRequest = function (key, searchRequest) {
        this.searchRequests[key] = searchRequest;
    };
    SrSearchRequestsService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], SrSearchRequestsService);
    return SrSearchRequestsService;
}());
exports.SrSearchRequestsService = SrSearchRequestsService;


/***/ },

/***/ "./src/app/pages/org-service-registry/shared/services/sr-view-model.service.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var mc_utils_1 = __webpack_require__("./src/app/shared/mc-utils.ts");
var util_1 = __webpack_require__("./node_modules/util/util.js");
var SrViewModelService = (function () {
    function SrViewModelService() {
    }
    SrViewModelService.prototype.ngOnInit = function () {
    };
    SrViewModelService.prototype.generateLabelValuesForSpecification = function (specification, organizationName) {
        var labelValues = undefined;
        if (specification) {
            labelValues = [];
            labelValues.push({ label: 'MRN', valueHtml: specification.specificationId });
            labelValues.push({ label: 'Name', valueHtml: specification.name });
            labelValues.push({ label: 'Version', valueHtml: specification.version });
            labelValues.push({ label: 'Status', valueHtml: specification.status });
            labelValues.push({ label: 'Organization', valueHtml: organizationName });
            labelValues.push({ label: 'Description', valueHtml: specification.description });
        }
        return labelValues;
    };
    SrViewModelService.prototype.generateLabelValuesForDesign = function (design, organizationName) {
        var labelValues = undefined;
        if (design) {
            labelValues = [];
            labelValues.push({ label: 'MRN', valueHtml: design.designId });
            labelValues.push({ label: 'Name', valueHtml: design.name });
            labelValues.push({ label: 'Version', valueHtml: design.version });
            labelValues.push({ label: 'Status', valueHtml: design.status });
            labelValues.push({ label: 'Organization', valueHtml: organizationName });
            labelValues.push({ label: 'Description', valueHtml: design.description });
        }
        return labelValues;
    };
    SrViewModelService.prototype.generateLabelValuesForInstance = function (instance, organizationName) {
        var labelValues = undefined;
        if (instance) {
            labelValues = [];
            labelValues.push({ label: 'MRN', valueHtml: instance.instanceId });
            labelValues.push({ label: 'Name', valueHtml: instance.name });
            labelValues.push({ label: 'Version', valueHtml: instance.version });
            labelValues.push({ label: 'Status', valueHtml: instance.status });
            labelValues.push({ label: 'Organization', valueHtml: organizationName });
            labelValues.push({ label: 'Description', valueHtml: instance.description });
            labelValues.push({ label: 'Service endpoint', valueHtml: instance.endpointUri });
            if (!util_1.isNullOrUndefined(instance.compliant)) {
                var compliantClass = instance.compliant ? '' : 'label-danger';
                labelValues.push({ label: 'Compliant', valueHtml: mc_utils_1.McUtils.getYesNoString(instance.compliant), linkClass: compliantClass });
            }
        }
        return labelValues;
    };
    SrViewModelService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], SrViewModelService);
    return SrViewModelService;
}());
exports.SrViewModelService = SrViewModelService;


/***/ },

/***/ "./src/app/pages/org-service-registry/specifications/components/specification-details/specification-details.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var mc_notifications_service_1 = __webpack_require__("./src/app/shared/mc-notifications.service.ts");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var specifications_service_1 = __webpack_require__("./src/app/backend-api/service-registry/services/specifications.service.ts");
var file_helper_service_1 = __webpack_require__("./src/app/shared/file-helper.service.ts");
var designs_service_1 = __webpack_require__("./src/app/backend-api/service-registry/services/designs.service.ts");
var navigation_helper_service_1 = __webpack_require__("./src/app/shared/navigation-helper.service.ts");
var sr_view_model_service_1 = __webpack_require__("./src/app/pages/org-service-registry/shared/services/sr-view-model.service.ts");
var auth_service_1 = __webpack_require__("./src/app/authentication/services/auth.service.ts");
var organizations_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/organizations.service.ts");
var endorsements_service_1 = __webpack_require__("./src/app/backend-api/endorsements/services/endorsements.service.ts");
var rxjs_1 = __webpack_require__("./node_modules/rxjs/Rx.js");
var sr_search_requests_service_1 = __webpack_require__("./src/app/pages/org-service-registry/shared/services/sr-search-requests.service.ts");
var app_constants_1 = __webpack_require__("./src/app/shared/app.constants.ts");
var SEARCH_KEY = 'SpecificationDetailsComponent';
var SpecificationDetailsComponent = (function () {
    function SpecificationDetailsComponent(searchRequestsService, endorsementsService, authService, route, router, viewModelService, navigationHelperService, notifications, specificationsService, designsService, fileHelperService, orgsService) {
        this.searchRequestsService = searchRequestsService;
        this.endorsementsService = endorsementsService;
        this.authService = authService;
        this.route = route;
        this.router = router;
        this.viewModelService = viewModelService;
        this.navigationHelperService = navigationHelperService;
        this.notifications = notifications;
        this.specificationsService = specificationsService;
        this.designsService = designsService;
        this.fileHelperService = fileHelperService;
        this.orgsService = orgsService;
        this.showModal = false;
        this.showModalNoDelete = false;
        this.endorsements = [];
        this.endorseMainSwitch = app_constants_1.SHOW_ENDORSEMENTS;
        // Search
        this.isSearchingDesigns = false;
        this.searchKey = SEARCH_KEY;
    }
    SpecificationDetailsComponent.prototype.ngOnInit = function () {
        this.onCreate = this.createDesign.bind(this);
        this.onGotoDesign = this.gotoDesign.bind(this);
        this.isLoadingSpecification = true;
        this.isLoadingDesigns = true;
        this.title = 'Loading ...';
        var specificationId = this.route.snapshot.params['id'];
        var version = this.route.snapshot.queryParams['specificationVersion'];
        this.loadSpecification(specificationId, version);
        if (app_constants_1.SHOW_ENDORSEMENTS) {
            this.loadEndorsements(specificationId, version);
        }
    };
    SpecificationDetailsComponent.prototype.downloadXml = function () {
        this.fileHelperService.downloadXml(this.specification.specAsXml);
    };
    SpecificationDetailsComponent.prototype.downloadDoc = function () {
        this.fileHelperService.downloadDoc(this.specification.specAsDoc);
    };
    SpecificationDetailsComponent.prototype.gotoDesign = function (index) {
        this.navigationHelperService.navigateToOrgDesign(this.designs[index].designId, this.designs[index].version);
    };
    SpecificationDetailsComponent.prototype.loadSpecification = function (specificationId, version) {
        var _this = this;
        this.specificationsService.getSpecification(specificationId, version).subscribe(function (specification) {
            _this.title = specification.name;
            _this.specification = specification;
            _this.loadOrganizationName();
            _this.loadDesigns();
        }, function (err) {
            // TODO: make this as a general component
            if (err.status == 404) {
                _this.router.navigate(['/error404'], { relativeTo: _this.route, replaceUrl: true });
            }
            _this.title = 'Error while loading';
            _this.isLoadingSpecification = false;
            _this.isLoadingDesigns = false;
            _this.notifications.generateNotification('Error', 'Error when trying to get specification', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    SpecificationDetailsComponent.prototype.loadOrganizationName = function () {
        var _this = this;
        this.orgsService.getOrganizationName(this.specification.organizationId).subscribe(function (organizationName) {
            _this.labelValues = _this.viewModelService.generateLabelValuesForSpecification(_this.specification, organizationName);
            _this.isLoadingSpecification = false;
        }, function (err) {
            _this.labelValues = _this.viewModelService.generateLabelValuesForSpecification(_this.specification, '');
            _this.isLoadingSpecification = false;
            _this.notifications.generateNotification('Error', 'Error when trying to get organization', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    SpecificationDetailsComponent.prototype.loadDesigns = function () {
        var searchRequest = this.searchRequestsService.getSearchRequest(SEARCH_KEY);
        this.initialSearchRequest = searchRequest;
        this.searchDesigns(searchRequest);
    };
    SpecificationDetailsComponent.prototype.createDesign = function () {
        this.navigationHelperService.navigateToCreateDesign(this.specification.specificationId, this.specification.version);
    };
    SpecificationDetailsComponent.prototype.isMyOrg = function () {
        return this.specification.organizationId === this.authService.authState.orgMrn;
    };
    SpecificationDetailsComponent.prototype.isServiceAdmin = function () {
        return this.authService.authState.hasPermission(auth_service_1.AuthPermission.ServiceAdmin);
    };
    SpecificationDetailsComponent.prototype.isServiceAdminForOrg = function () {
        return (this.authService.authState.hasPermission(auth_service_1.AuthPermission.ServiceAdmin) && this.isMyOrg()) || this.authService.authState.hasPermission(auth_service_1.AuthPermission.SiteAdmin);
    };
    SpecificationDetailsComponent.prototype.isEndorseAdmin = function () {
        return this.authService.authState.hasPermission(auth_service_1.AuthPermission.OrgAdmin);
    };
    SpecificationDetailsComponent.prototype.showUpdate = function () {
        return this.isServiceAdminForOrg();
    };
    SpecificationDetailsComponent.prototype.update = function () {
        this.navigationHelperService.navigateToUpdateSpecification(this.specification.specificationId, this.specification.version);
    };
    SpecificationDetailsComponent.prototype.shouldDisplayDelete = function () {
        return this.isServiceAdminForOrg() && !this.isLoadingDesigns;
    };
    SpecificationDetailsComponent.prototype.hasDesigns = function () {
        return this.designs && this.designs.length > 0;
    };
    SpecificationDetailsComponent.prototype.delete = function () {
        if (this.hasDesigns()) {
            this.modalDescriptionNoDelete = "Specification can't be deleted with active Technical Designs.<br><br>You must first delete the Technical Designs.";
            this.showModalNoDelete = true;
        }
        else {
            this.modalDescription = 'Do you want to delete the specification?';
            this.showModal = true;
        }
    };
    SpecificationDetailsComponent.prototype.cancelModal = function () {
        this.showModal = false;
        this.showModalNoDelete = false;
    };
    SpecificationDetailsComponent.prototype.deleteForSure = function () {
        var _this = this;
        this.showModal = false;
        this.isLoadingSpecification = true;
        this.specificationsService.deleteSpecification(this.specification).subscribe(function () {
            _this.deleteEndorsements();
        }, function (err) {
            _this.isLoadingSpecification = false;
            _this.notifications.generateNotification('Error', 'Error when trying to delete specification', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    // Endorsement
    SpecificationDetailsComponent.prototype.deleteEndorsements = function () {
        var _this = this;
        if (this.endorsements && this.endorsements.length > 0) {
            this.endorsementsService.removeAllEndorsementsOfDesign(this.specification.specificationId).subscribe(function () {
                _this.navigationHelperService.navigateToOrgSpecification('', '');
            }, function (err) {
                _this.notifications.generateNotification('Error', 'Error when trying to delete endorsements of specification', mc_notifications_service_1.MCNotificationType.Error, err);
                _this.navigationHelperService.navigateToOrgSpecification('', '');
            });
        }
        else {
            this.navigationHelperService.navigateToOrgSpecification('', '');
        }
    };
    SpecificationDetailsComponent.prototype.loadEndorsements = function (specificationId, specificationVersion) {
        var _this = this;
        this.isLoadingEndorsements = true;
        var parallelObservables = [];
        parallelObservables.push(this.endorsementsService.isSpecificationEndorsedByMyOrg(specificationId, specificationVersion).take(1));
        parallelObservables.push(this.endorsementsService.getEndorsementsForSpecification(specificationId, specificationVersion).take(1));
        return rxjs_1.Observable.forkJoin(parallelObservables).subscribe(function (resultArray) {
            var isEndorsedByMyOrg = resultArray[0];
            var pageEndorsement = resultArray[1];
            _this.endorsements = pageEndorsement.content;
            _this.isEndorsedByMyOrg = isEndorsedByMyOrg;
            _this.isLoadingEndorsements = false;
            _this.showEndorsements = true;
        }, function (err) {
            _this.showEndorsements = false;
            _this.isLoadingEndorsements = false;
            _this.notifications.generateNotification('Error', 'Error when trying to get endorsements for specification', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    SpecificationDetailsComponent.prototype.endorseToggle = function () {
        if (this.isEndorsedByMyOrg) {
            this.removeEndorse();
        }
        else {
            this.endorse();
        }
    };
    SpecificationDetailsComponent.prototype.endorse = function () {
        var _this = this;
        this.isEndorsing = true;
        this.endorsementsService.endorseSpecification(this.specification.specificationId, this.specification.version).subscribe(function (_) {
            _this.isEndorsedByMyOrg = true;
            _this.isEndorsing = false;
            _this.loadEndorsements(_this.specification.specificationId, _this.specification.version);
        }, function (err) {
            _this.isEndorsing = false;
            _this.notifications.generateNotification('Error', 'Error when trying to endorse specification', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    SpecificationDetailsComponent.prototype.removeEndorse = function () {
        var _this = this;
        this.isEndorsing = true;
        this.endorsementsService.removeEndorsementOfSpecification(this.specification.specificationId, this.specification.version).subscribe(function (_) {
            _this.isEndorsedByMyOrg = false;
            _this.isEndorsing = false;
            _this.loadEndorsements(_this.specification.specificationId, _this.specification.version);
        }, function (err) {
            _this.isEndorsing = false;
            _this.notifications.generateNotification('Error', 'Error when trying to remove endorse of specification', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    SpecificationDetailsComponent.prototype.shouldDisplayEndorsementButton = function () {
        return app_constants_1.SHOW_ENDORSEMENTS && this.isEndorseAdmin() && this.showEndorsements;
    };
    // Search
    SpecificationDetailsComponent.prototype.search = function (searchRequest) {
        this.isSearchingDesigns = true;
        this.searchDesigns(searchRequest);
    };
    SpecificationDetailsComponent.prototype.searchDesigns = function (searchRequest) {
        var _this = this;
        this.designsService.searchDesignsForSpecification(searchRequest, this.specification.specificationId, this.specification.version).subscribe(function (designs) {
            _this.designs = designs;
            _this.isLoadingDesigns = false;
            _this.isSearchingDesigns = false;
            _this.initialSearchRequest = searchRequest;
        }, function (err) {
            _this.searchRequestsService.addSearchRequest(SEARCH_KEY, _this.initialSearchRequest);
            _this.isLoadingDesigns = false;
            _this.isSearchingDesigns = false;
            _this.notifications.generateNotification('Error', 'Error when trying to search designs', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    SpecificationDetailsComponent = __decorate([
        core_1.Component({
            selector: 'specification-details',
            encapsulation: core_1.ViewEncapsulation.None,
            template: __webpack_require__("./src/app/pages/org-service-registry/specifications/components/specification-details/specification-details.html"),
            styles: []
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof sr_search_requests_service_1.SrSearchRequestsService !== 'undefined' && sr_search_requests_service_1.SrSearchRequestsService) === 'function' && _a) || Object, (typeof (_b = typeof endorsements_service_1.EndorsementsService !== 'undefined' && endorsements_service_1.EndorsementsService) === 'function' && _b) || Object, (typeof (_c = typeof auth_service_1.AuthService !== 'undefined' && auth_service_1.AuthService) === 'function' && _c) || Object, (typeof (_d = typeof router_1.ActivatedRoute !== 'undefined' && router_1.ActivatedRoute) === 'function' && _d) || Object, (typeof (_e = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _e) || Object, (typeof (_f = typeof sr_view_model_service_1.SrViewModelService !== 'undefined' && sr_view_model_service_1.SrViewModelService) === 'function' && _f) || Object, (typeof (_g = typeof navigation_helper_service_1.NavigationHelperService !== 'undefined' && navigation_helper_service_1.NavigationHelperService) === 'function' && _g) || Object, (typeof (_h = typeof mc_notifications_service_1.MCNotificationsService !== 'undefined' && mc_notifications_service_1.MCNotificationsService) === 'function' && _h) || Object, (typeof (_j = typeof specifications_service_1.SpecificationsService !== 'undefined' && specifications_service_1.SpecificationsService) === 'function' && _j) || Object, (typeof (_k = typeof designs_service_1.DesignsService !== 'undefined' && designs_service_1.DesignsService) === 'function' && _k) || Object, (typeof (_l = typeof file_helper_service_1.FileHelperService !== 'undefined' && file_helper_service_1.FileHelperService) === 'function' && _l) || Object, (typeof (_m = typeof organizations_service_1.OrganizationsService !== 'undefined' && organizations_service_1.OrganizationsService) === 'function' && _m) || Object])
    ], SpecificationDetailsComponent);
    return SpecificationDetailsComponent;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
}());
exports.SpecificationDetailsComponent = SpecificationDetailsComponent;


/***/ },

/***/ "./src/app/pages/org-service-registry/specifications/components/specification-details/specification-details.html":
/***/ function(module, exports) {

module.exports = "<div class=\"row\">\n  <div class=\"col-lg-12\">\n    <ba-card title=\"{{title}}\" baCardClass=\"with-scroll table-panel\">\n      <mc-label-value-table [isLoading]=\"isLoadingSpecification\" [labelValues]=\"labelValues\"></mc-label-value-table>\n      <ul *ngIf=\"specification && !isLoadingSpecification\" class=\"btn-list clearfix\">\n        <li *ngIf=\"specification.specAsDoc\">\n          <button type=\"button\" class=\"btn btn-primary btn-raised\" (click)=\"downloadDoc()\">Download document</button>\n        </li>\n        <li *ngIf=\"specification.specAsXml\">\n          <button type=\"button\" class=\"btn btn-primary btn-raised\" (click)=\"downloadXml()\">Download XML</button>\n        </li>\n        <li *ngIf=\"showUpdate()\">\n          <button type=\"button\" class=\"btn btn-primary btn-raised\" (click)=\"update()\">Update Specification</button>\n        </li>\n        <li *ngIf=\"shouldDisplayDelete()\">\n          <button type=\"button\" class=\"btn btn-danger btn-raised\" (click)=\"delete()\">Delete Specification</button>\n        </li>\n        <li *ngIf=\"shouldDisplayEndorsementButton() && !isLoadingDesigns\">\n          <mc-endorse-button [isEndorsedByMyOrg]=\"isEndorsedByMyOrg\" [isEndorsing]=\"isEndorsing\"[title]=\"'Specification'\" (onEndorse)=\"endorseToggle()\"></mc-endorse-button>\n        </li>\n      </ul>\n    </ba-card>\n\n    <div *ngIf=\"endorseMainSwitch\">\n      <endorsed-by-list [title]=\"'Organizations endorsing the Specification (' + title + ')'\" [endorsements]=\"endorsements\" [isLoading]=\"isLoadingEndorsements\"></endorsed-by-list>\n    </div>\n\n    <ba-card title=\"Designs implementing the Specification ({{specification?.name}})\" baCardClass=\"with-scroll table-panel\">\n      <div *ngIf=\"!isLoadingDesigns\">\n        <service-registry-search [showKeywords]=\"false\" [searchTitle]=\"'Design search filters'\" [searchKey]=\"searchKey\" [isSearching]=\"isSearchingDesigns\" [showEndorsement]=\"true\" [preFilterMyOrg]=\"false\" (onSearch)=\"search($event)\"></service-registry-search>\n\n        <div class=\"separator\"></div>\n      </div>\n      <div class=\"create-loading-wrapper\">\n        <mc-create-button [isAdmin]=\"isServiceAdmin()\" *ngIf=\"!isLoadingDesigns\" title=\"Register new Design\" [onClick]=\"onCreate\"></mc-create-button>\n        <sk-fading-circle-small class=\"create-loading\" [isRunning]=\"isSearchingDesigns\"></sk-fading-circle-small>\n      </div>\n      <designs-table [designs]=\"designs\" [isLoading]=\"isLoadingDesigns\" [onRowClick]=\"onGotoDesign\"></designs-table>\n    </ba-card>\n  </div>\n</div>\n<mc-modal (onCancel)=\"cancelModal()\" (onOk)=\"deleteForSure()\" [show]=\"showModal\" [title]=\"'Delete Specification'\" [description]=\"modalDescription\" [cancelClass]=\"'btn btn-default btn-raised'\" [cancelTitle]=\"'Cancel'\" [okClass]=\"'btn btn-danger btn-raised'\" [okTitle]=\"'Delete'\"></mc-modal>\n<mc-modal (onOk)=\"cancelModal()\" [show]=\"showModalNoDelete\" [title]=\"'Delete Specification'\" [description]=\"modalDescriptionNoDelete\" [okClass]=\"'btn btn-default btn-raised'\" [okTitle]=\"'OK'\"></mc-modal>\n"

/***/ },

/***/ "./src/app/pages/org-service-registry/specifications/components/specification-list/specification-list.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var organizations_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/organizations.service.ts");
var mc_notifications_service_1 = __webpack_require__("./src/app/shared/mc-notifications.service.ts");
var specifications_service_1 = __webpack_require__("./src/app/backend-api/service-registry/services/specifications.service.ts");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var navigation_helper_service_1 = __webpack_require__("./src/app/shared/navigation-helper.service.ts");
var sr_search_requests_service_1 = __webpack_require__("./src/app/pages/org-service-registry/shared/services/sr-search-requests.service.ts");
var auth_service_1 = __webpack_require__("./src/app/authentication/services/auth.service.ts");
var SEARCH_KEY = 'SpecificationListComponent';
var SpecificationListComponent = (function () {
    function SpecificationListComponent(authService, searchRequestsService, navigationService, route, router, notifications, orgService, specificationsService) {
        this.authService = authService;
        this.searchRequestsService = searchRequestsService;
        this.navigationService = navigationService;
        this.route = route;
        this.router = router;
        this.notifications = notifications;
        this.orgService = orgService;
        this.specificationsService = specificationsService;
        this.searchKey = SEARCH_KEY;
        this.isSearching = false;
    }
    SpecificationListComponent.prototype.ngOnInit = function () {
        this.cardTitle = 'Specifications';
        this.onCreate = this.createSpecification.bind(this);
        this.onGotoSpec = this.gotoSpecification.bind(this);
        this.isLoading = true;
        this.loadMyOrganization();
        this.loadSpecifications();
    };
    SpecificationListComponent.prototype.search = function (searchRequest) {
        this.isSearching = true;
        this.searchSpecifications(searchRequest);
    };
    SpecificationListComponent.prototype.isAdmin = function () {
        return this.authService.authState.hasPermission(auth_service_1.AuthPermission.ServiceAdmin);
    };
    SpecificationListComponent.prototype.searchSpecifications = function (searchRequest) {
        var _this = this;
        this.specificationsService.searchSpecifications(searchRequest).subscribe(function (specifications) {
            _this.specifications = specifications;
            _this.isSearching = false;
            _this.isLoading = false;
            _this.initialSearchRequest = searchRequest;
        }, function (err) {
            _this.searchRequestsService.addSearchRequest(SEARCH_KEY, _this.initialSearchRequest);
            _this.isSearching = false;
            _this.isLoading = false;
            _this.notifications.generateNotification('Error', 'Error when trying to search specifications', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    SpecificationListComponent.prototype.loadMyOrganization = function () {
        var _this = this;
        this.orgService.getMyOrganization().subscribe(function (organization) {
            _this.organization = organization;
        }, function (err) {
            _this.notifications.generateNotification('Error', 'Error when trying to get organization', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    SpecificationListComponent.prototype.loadSpecifications = function () {
        var _this = this;
        var searchRequest = this.searchRequestsService.getSearchRequest(SEARCH_KEY);
        this.initialSearchRequest = searchRequest;
        if (searchRequest) {
            this.searchSpecifications(searchRequest);
        }
        else {
            this.specificationsService.getSpecificationsForMyOrg().subscribe(function (specifications) {
                _this.specifications = specifications;
                _this.isLoading = false;
            }, function (err) {
                _this.isLoading = false;
                _this.notifications.generateNotification('Error', 'Error when trying to get specifications', mc_notifications_service_1.MCNotificationType.Error, err);
            });
        }
    };
    SpecificationListComponent.prototype.createSpecification = function () {
        this.navigationService.navigateToCreateSpecification();
    };
    SpecificationListComponent.prototype.gotoSpecification = function (index) {
        this.router.navigate([this.specifications[index].specificationId], { queryParams: { specificationVersion: this.specifications[index].version }, relativeTo: this.route });
    };
    SpecificationListComponent = __decorate([
        core_1.Component({
            selector: 'specification-list',
            encapsulation: core_1.ViewEncapsulation.None,
            template: __webpack_require__("./src/app/pages/org-service-registry/specifications/components/specification-list/specification-list.html"),
            styles: []
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof auth_service_1.AuthService !== 'undefined' && auth_service_1.AuthService) === 'function' && _a) || Object, (typeof (_b = typeof sr_search_requests_service_1.SrSearchRequestsService !== 'undefined' && sr_search_requests_service_1.SrSearchRequestsService) === 'function' && _b) || Object, (typeof (_c = typeof navigation_helper_service_1.NavigationHelperService !== 'undefined' && navigation_helper_service_1.NavigationHelperService) === 'function' && _c) || Object, (typeof (_d = typeof router_1.ActivatedRoute !== 'undefined' && router_1.ActivatedRoute) === 'function' && _d) || Object, (typeof (_e = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _e) || Object, (typeof (_f = typeof mc_notifications_service_1.MCNotificationsService !== 'undefined' && mc_notifications_service_1.MCNotificationsService) === 'function' && _f) || Object, (typeof (_g = typeof organizations_service_1.OrganizationsService !== 'undefined' && organizations_service_1.OrganizationsService) === 'function' && _g) || Object, (typeof (_h = typeof specifications_service_1.SpecificationsService !== 'undefined' && specifications_service_1.SpecificationsService) === 'function' && _h) || Object])
    ], SpecificationListComponent);
    return SpecificationListComponent;
    var _a, _b, _c, _d, _e, _f, _g, _h;
}());
exports.SpecificationListComponent = SpecificationListComponent;


/***/ },

/***/ "./src/app/pages/org-service-registry/specifications/components/specification-list/specification-list.html":
/***/ function(module, exports) {

module.exports = "<div class=\"row\">\n  <div class=\"col-lg-12\">\n    <ba-card title=\"{{cardTitle}}\" baCardClass=\"with-scroll table-panel\">\n      <service-registry-search [searchTitle]=\"'Search filters'\" [searchKey]=\"searchKey\" [isSearching]=\"isSearching\" [showEndorsement]=\"true\" [preFilterMyOrg]=\"true\" (onSearch)=\"search($event)\"></service-registry-search>\n\n      <div class=\"separator\"></div>\n\n      <mc-create-button [isAdmin]=\"isAdmin()\" *ngIf=\"!isLoading\" title=\"Register new Specification\" [onClick]=\"onCreate\" ></mc-create-button>\n      <specifications-table [specifications]=\"specifications\" [isLoading]=\"isLoading\" [onRowClick]=\"onGotoSpec\"></specifications-table>\n    </ba-card>\n  </div>\n</div>\n"

/***/ },

/***/ "./src/app/pages/org-service-registry/specifications/components/specification-new/specification-new.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var specifications_service_1 = __webpack_require__("./src/app/backend-api/service-registry/services/specifications.service.ts");
var mc_notifications_service_1 = __webpack_require__("./src/app/shared/mc-notifications.service.ts");
var organizations_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/organizations.service.ts");
var mcFileUploader_component_1 = __webpack_require__("./src/app/theme/components/mcFileUploader/mcFileUploader.component.ts");
var navigation_helper_service_1 = __webpack_require__("./src/app/shared/navigation-helper.service.ts");
var _ = __webpack_require__("./node_modules/lodash/lodash.js");
var mrn_helper_service_1 = __webpack_require__("./src/app/shared/mrn-helper.service.ts");
var specification_xml_parser_service_1 = __webpack_require__("./src/app/pages/org-service-registry/shared/services/specification-xml-parser.service.ts");
var sr_view_model_service_1 = __webpack_require__("./src/app/pages/org-service-registry/shared/services/sr-view-model.service.ts");
var SpecificationNewComponent = (function () {
    function SpecificationNewComponent(viewModelService, xmlParser, mrnHelper, navigationService, notifications, specificationsService, orgService) {
        this.viewModelService = viewModelService;
        this.xmlParser = xmlParser;
        this.mrnHelper = mrnHelper;
        this.navigationService = navigationService;
        this.notifications = notifications;
        this.specificationsService = specificationsService;
        this.orgService = orgService;
        this.hasMrnError = false;
        this.captionXml = 'Upload Specification XML file';
        this.captionDoc = 'Upload Specification Document file';
        this.fileTypeXml = mcFileUploader_component_1.FileUploadType.Xml;
        this.fileTypeDoc = mcFileUploader_component_1.FileUploadType.Doc;
        this.requiredTextXml = 'You need to upload XML file';
        this.requiredTextDoc = 'You need to upload a DOCX, ODT or PDF file';
        this.isFormValid = false;
        this.isLoading = true;
        this.isRegistering = false;
        this.registerTitle = "Register Specification";
        this.registerButtonClass = "btn btn-danger btn-raised";
    }
    SpecificationNewComponent.prototype.ngOnInit = function () {
        this.onRegister = this.register.bind(this);
        this.isRegistering = false;
        this.loadMyOrganization();
        this.calculateFormValid();
        this.updateUI();
    };
    SpecificationNewComponent.prototype.calculateFormValid = function () {
        this.isFormValid = this.xml != null;
    };
    SpecificationNewComponent.prototype.onUploadDoc = function (file) {
        this.doc = file;
        this.calculateFormValid();
    };
    SpecificationNewComponent.prototype.onUploadXml = function (file) {
        if (file && this.isXmlValid(file)) {
            this.xml = file;
        }
        else {
            this.resetXmlFile();
        }
        this.calculateFormValid();
        this.updateUI();
    };
    SpecificationNewComponent.prototype.isXmlValid = function (file) {
        try {
            var mrn = this.xmlParser.getMrn(file);
            var isValid = this.mrnHelper.checkMrnForSpecification(mrn);
            this.hasMrnError = !isValid;
            if (!isValid) {
                this.mrnErrorText = "The ID in the XML-file is wrong. The ID is supposed to be an MRN in the following format:<BR>"
                    + this.mrnHelper.mrnMaskForSpecification() + "'ID'<BR>"
                    + "'ID'=" + this.mrnHelper.mrnPatternError();
            }
            return isValid;
        }
        catch (error) {
            this.notifications.generateNotification('Error in XML', error.message, mc_notifications_service_1.MCNotificationType.Error, error);
            return false;
        }
    };
    SpecificationNewComponent.prototype.cancel = function () {
        this.navigationService.cancelCreateSpecification();
    };
    SpecificationNewComponent.prototype.register = function () {
        this.isRegistering = true;
        this.createSpecification(this.parsedSpecification);
    };
    SpecificationNewComponent.prototype.createSpecification = function (specification) {
        var _this = this;
        this.specificationsService.createSpecification(specification).subscribe(function (specification) {
            _this.isRegistering = false;
            _this.navigationService.navigateToOrgSpecification(specification.specificationId, specification.version);
        }, function (err) {
            _this.isRegistering = false;
            _this.notifications.generateNotification('Error', 'Error when trying to create specification', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    SpecificationNewComponent.prototype.loadMyOrganization = function () {
        var _this = this;
        this.isLoading = true;
        this.orgService.getMyOrganization().subscribe(function (organization) {
            _this.organization = organization;
            _this.isLoading = false;
        }, function (err) {
            _this.notifications.generateNotification('Error', 'Error when trying to get organization', mc_notifications_service_1.MCNotificationType.Error);
            _this.isLoading = false;
        });
    };
    SpecificationNewComponent.prototype.resetXmlFile = function () {
        this.xml = null;
        this.fileUploadXml.resetFileSelection();
    };
    SpecificationNewComponent.prototype.updateUI = function () {
        if (this.xml) {
            this.parseSpecification();
        }
        else {
            this.parsedSpecification = null;
            this.setupLableValues();
        }
    };
    SpecificationNewComponent.prototype.parseSpecification = function () {
        this.parsedSpecification = null;
        try {
            var specification = {};
            specification.specAsXml = _.cloneDeep(this.xml);
            specification.specAsDoc = this.doc;
            specification.name = this.xmlParser.getName(this.xml);
            specification.description = this.xmlParser.getDescription(this.xml);
            specification.specificationId = this.xmlParser.getMrn(this.xml);
            specification.keywords = this.xmlParser.getKeywords(this.xml);
            specification.status = this.xmlParser.getStatus(this.xml);
            specification.organizationId = this.organization.mrn;
            specification.version = this.xmlParser.getVersion(this.xml);
            this.parsedSpecification = specification;
        }
        catch (error) {
            this.isRegistering = false;
            this.resetXmlFile();
            this.notifications.generateNotification('Error in XML', error.message, mc_notifications_service_1.MCNotificationType.Error, error);
        }
        finally {
            this.setupLableValues();
        }
    };
    SpecificationNewComponent.prototype.setupLableValues = function () {
        this.labelValues = [];
        this.labelValues.push({ label: 'Upload XML', valueHtml: '' });
        if (this.organization && this.parsedSpecification) {
            this.labelValues = this.viewModelService.generateLabelValuesForSpecification(this.parsedSpecification, this.organization.name);
        }
    };
    __decorate([
        core_1.ViewChild('uploadXml'), 
        __metadata('design:type', (typeof (_a = typeof mcFileUploader_component_1.McFileUploader !== 'undefined' && mcFileUploader_component_1.McFileUploader) === 'function' && _a) || Object)
    ], SpecificationNewComponent.prototype, "fileUploadXml", void 0);
    SpecificationNewComponent = __decorate([
        core_1.Component({
            selector: 'specification-new',
            encapsulation: core_1.ViewEncapsulation.None,
            template: __webpack_require__("./src/app/pages/org-service-registry/specifications/components/specification-new/specification-new.html"),
            styles: []
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof sr_view_model_service_1.SrViewModelService !== 'undefined' && sr_view_model_service_1.SrViewModelService) === 'function' && _b) || Object, (typeof (_c = typeof specification_xml_parser_service_1.SpecificationXmlParser !== 'undefined' && specification_xml_parser_service_1.SpecificationXmlParser) === 'function' && _c) || Object, (typeof (_d = typeof mrn_helper_service_1.MrnHelperService !== 'undefined' && mrn_helper_service_1.MrnHelperService) === 'function' && _d) || Object, (typeof (_e = typeof navigation_helper_service_1.NavigationHelperService !== 'undefined' && navigation_helper_service_1.NavigationHelperService) === 'function' && _e) || Object, (typeof (_f = typeof mc_notifications_service_1.MCNotificationsService !== 'undefined' && mc_notifications_service_1.MCNotificationsService) === 'function' && _f) || Object, (typeof (_g = typeof specifications_service_1.SpecificationsService !== 'undefined' && specifications_service_1.SpecificationsService) === 'function' && _g) || Object, (typeof (_h = typeof organizations_service_1.OrganizationsService !== 'undefined' && organizations_service_1.OrganizationsService) === 'function' && _h) || Object])
    ], SpecificationNewComponent);
    return SpecificationNewComponent;
    var _a, _b, _c, _d, _e, _f, _g, _h;
}());
exports.SpecificationNewComponent = SpecificationNewComponent;


/***/ },

/***/ "./src/app/pages/org-service-registry/specifications/components/specification-new/specification-new.html":
/***/ function(module, exports) {

module.exports = "<div class=\"row\">\n  <div class=\"col-lg-12\">\n    <ba-card title=\"Register new Specification for {{organization?.name}}\" baCardClass=\"with-scroll table-panel\">\n      <div *ngIf=\"organization?.mrn\">\n        <form>\n          <mc-file-uploader #uploadXml [caption]=\"captionXml\" [fileUploadType]=\"fileTypeXml\" [requiredText]=\"requiredTextXml\" (onUpload)=\"onUploadXml($event)\"></mc-file-uploader>\n          <mc-file-uploader [caption]=\"captionDoc\" [fileUploadType]=\"fileTypeDoc\" [requiredText]=\"requiredTextDoc\" (onUpload)=\"onUploadDoc($event)\"></mc-file-uploader>\n          <div *ngIf=\"hasMrnError\" class=\"error-notice\" [innerHTML]=\"mrnErrorText | undefined | sanitizeHtml\"></div>\n          <ul class=\"btn-list clearfix\">\n            <li>\n              <mc-loading-button [class]=\"registerButtonClass\" [disabled]=\"!isFormValid\" [isLoading]=\"isRegistering\" [title]=\"registerTitle\" [onClick]=\"onRegister\" ></mc-loading-button>\n            </li>\n            <li>\n              <button type=\"button\" class=\"btn btn-default btn-raised\" (click)=\"cancel()\">Cancel</button>\n            </li>\n          </ul>\n        </form>\n\n        <div class=\"separator\"></div>\n\n        <mc-label-value-table [isLoading]=\"false\" [labelValues]=\"labelValues\"></mc-label-value-table>\n      </div>\n      <sk-fading-circle [isRunning]=\"isLoading\" ></sk-fading-circle>\n      <div class=\"no-data\" *ngIf=\"!organization?.mrn && !isLoading\">No data</div>\n    </ba-card>\n  </div>\n</div>\n"

/***/ },

/***/ "./src/app/pages/org-service-registry/specifications/components/specification-update/specification-update.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var mc_notifications_service_1 = __webpack_require__("./src/app/shared/mc-notifications.service.ts");
var mcFileUploader_component_1 = __webpack_require__("./src/app/theme/components/mcFileUploader/mcFileUploader.component.ts");
var navigation_helper_service_1 = __webpack_require__("./src/app/shared/navigation-helper.service.ts");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var mcFormControlModel_1 = __webpack_require__("./src/app/theme/components/mcForm/mcFormControlModel.ts");
var forms_1 = __webpack_require__("./node_modules/@angular/forms/index.js");
var organizations_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/organizations.service.ts");
var sr_view_model_service_1 = __webpack_require__("./src/app/pages/org-service-registry/shared/services/sr-view-model.service.ts");
var specifications_service_1 = __webpack_require__("./src/app/backend-api/service-registry/services/specifications.service.ts");
var specification_xml_parser_service_1 = __webpack_require__("./src/app/pages/org-service-registry/shared/services/specification-xml-parser.service.ts");
var SpecificationUpdateComponent = (function () {
    function SpecificationUpdateComponent(orgsService, viewModelService, formBuilder, xmlParser, router, activatedRoute, navigationService, notifications, specificationsService) {
        this.orgsService = orgsService;
        this.viewModelService = viewModelService;
        this.formBuilder = formBuilder;
        this.xmlParser = xmlParser;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.navigationService = navigationService;
        this.notifications = notifications;
        this.specificationsService = specificationsService;
        this.hasError = false;
        this.captionXml = 'Upload Specification XML file';
        this.captionDoc = 'Upload Specification Document file';
        this.fileTypeXml = mcFileUploader_component_1.FileUploadType.Xml;
        this.fileTypeDoc = mcFileUploader_component_1.FileUploadType.Doc;
        this.isLoading = true;
        this.isUpdating = false;
        this.updateTitle = "Update Specification";
        this.isFormChanged = false;
        this.status = '';
    }
    SpecificationUpdateComponent.prototype.ngOnInit = function () {
        this.isUpdating = false;
        this.isLoading = true;
        this.loadSpecification();
        this.updateUI();
    };
    SpecificationUpdateComponent.prototype.setFormChanged = function () {
        var changed = false;
        if (this.xml || this.doc) {
            changed = true;
        }
        else if (this.status != this.specification.status) {
            changed = true;
        }
        this.isFormChanged = changed;
    };
    SpecificationUpdateComponent.prototype.onUploadDoc = function (file) {
        this.doc = file;
        this.hasError = false;
        this.setFormChanged();
        this.generateForm();
    };
    SpecificationUpdateComponent.prototype.onUploadXml = function (file) {
        this.hasError = false;
        if (file) {
            var isValid = this.isXmlValid(file);
            this.hasError = !isValid;
            if (isValid) {
                this.xml = file;
            }
            else {
                this.resetXmlFile();
            }
        }
        else {
            this.hasError = false;
            this.resetXmlFile();
        }
        this.setFormChanged();
        this.generateForm();
        this.updateUI();
    };
    SpecificationUpdateComponent.prototype.resetXmlFile = function () {
        this.status = this.specification.status;
        this.xml = null;
        this.fileUploadXml.resetFileSelection();
        this.updateUI();
    };
    SpecificationUpdateComponent.prototype.updateUI = function () {
        if (this.xml) {
            this.parseSpecification();
        }
        else {
            this.parsedSpecification = null;
            this.setupLableValuesParsed();
        }
    };
    SpecificationUpdateComponent.prototype.isXmlValid = function (file) {
        try {
            return this.parseDisplayValues(file);
        }
        catch (error) {
            this.errorText = "Error in XML.<BR>";
            this.notifications.generateNotification('Error in XML', error.message, mc_notifications_service_1.MCNotificationType.Error, error);
            return false;
        }
    };
    SpecificationUpdateComponent.prototype.parseSpecification = function () {
        this.parsedSpecification = null;
        try {
            if (this.xml) {
                var specification = _.cloneDeep(this.specification);
                // Already contains an XML, so just update the values and not the ID
                specification.specAsXml.content = this.xml.content;
                specification.specAsXml.contentContentType = this.xml.contentContentType;
                specification.specAsXml.name = this.xml.name;
                specification.name = this.xmlParser.getName(this.xml);
                specification.description = this.xmlParser.getDescription(this.xml);
                specification.status = this.xmlParser.getStatus(this.xml);
                specification.version = this.xmlParser.getVersion(this.xml);
                this.parsedSpecification = specification;
            }
        }
        catch (error) {
            this.isUpdating = false;
            this.notifications.generateNotification('Error in XML', error.message, mc_notifications_service_1.MCNotificationType.Error, error);
            this.resetXmlFile();
            this.setFormChanged();
            this.generateForm();
            this.updateUI();
        }
        finally {
            this.setupLableValuesParsed();
        }
    };
    SpecificationUpdateComponent.prototype.parseDisplayValues = function (file) {
        this.status = this.xmlParser.getStatus(file);
        var parsedMrn = this.xmlParser.getMrn(file);
        var parsedVersion = this.xmlParser.getVersion(file);
        if (parsedMrn != this.specification.specificationId || parsedVersion != this.specification.version) {
            this.errorText = "The MRN and Version in the XML are not the same as the MRN and Version of this Specification. If the MRN or Version needs to be changed, please create a NEW Specification instead of updating an existing.<BR><BR>"
                + "Xml-parsed MRN: " + parsedMrn + "<BR>"
                + "Xml-parsed Version: " + parsedVersion + "<BR>";
            return false;
        }
        else {
            return true;
        }
    };
    SpecificationUpdateComponent.prototype.setupLableValuesParsed = function () {
        var _this = this;
        this.labelValuesParsed = [];
        this.labelValuesParsed.push({ label: 'Upload XML', valueHtml: '' });
        if (this.parsedSpecification) {
            this.orgsService.getOrganizationName(this.specification.organizationId).subscribe(function (organizationName) {
                _this.labelValuesParsed = _this.viewModelService.generateLabelValuesForSpecification(_this.parsedSpecification, organizationName);
            }, function (err) {
                _this.labelValuesParsed = _this.viewModelService.generateLabelValuesForSpecification(_this.parsedSpecification, '');
                _this.notifications.generateNotification('Error', 'Error when trying to get organization', mc_notifications_service_1.MCNotificationType.Error, err);
            });
        }
    };
    SpecificationUpdateComponent.prototype.cancel = function () {
        this.navigationService.navigateToOrgSpecification(this.specificationIdFromRoute, this.versionFromRoute);
    };
    SpecificationUpdateComponent.prototype.update = function () {
        this.isUpdating = true;
        if (this.xml || this.doc) {
            if (this.xml) {
                this.specification = this.parsedSpecification;
            }
            if (this.doc) {
                if (this.specification.specAsDoc) {
                    this.specification.specAsDoc.filecontent = this.doc.filecontent;
                    this.specification.specAsDoc.filecontentContentType = this.doc.filecontentContentType;
                    this.specification.specAsDoc.name = this.doc.name;
                }
                else {
                    this.specification.specAsDoc = this.doc;
                }
            }
            this.updateSpecification();
        }
        else {
            this.status = this.updateForm.value.status;
            this.updateStatus();
        }
    };
    SpecificationUpdateComponent.prototype.updateStatus = function () {
        var _this = this;
        this.specificationsService.updateStatus(this.specification, this.status).subscribe(function (_) {
            _this.navigationService.navigateToOrgSpecification(_this.specification.specificationId, _this.specification.version);
        }, function (err) {
            _this.isUpdating = false;
            _this.notifications.generateNotification('Error', 'Error when trying to update status of specification', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    SpecificationUpdateComponent.prototype.updateSpecification = function () {
        var _this = this;
        var updateDoc = this.doc != null;
        var updateXml = this.xml != null;
        this.specificationsService.updateSpecification(this.specification, updateDoc, updateXml).subscribe(function (_) {
            _this.navigationService.navigateToOrgSpecification(_this.specification.specificationId, _this.specification.version);
        }, function (err) {
            _this.isUpdating = false;
            _this.notifications.generateNotification('Error', 'Error when trying to update specification', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    SpecificationUpdateComponent.prototype.loadSpecification = function () {
        var _this = this;
        this.specificationIdFromRoute = this.activatedRoute.snapshot.params['id'];
        this.versionFromRoute = this.activatedRoute.snapshot.queryParams['specificationVersion'];
        this.specificationsService.getSpecification(this.specificationIdFromRoute, this.versionFromRoute).subscribe(function (specification) {
            _this.specification = specification;
            _this.status = _this.specification.status;
            _this.generateLabelValues();
            _this.generateForm();
            _this.isLoading = false;
        }, function (err) {
            // TODO: make this as a general component
            if (err.status == 404) {
                _this.router.navigate(['/error404'], { relativeTo: _this.activatedRoute, replaceUrl: true });
            }
            _this.isLoading = false;
            _this.notifications.generateNotification('Error', 'Error when trying to get specification', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    SpecificationUpdateComponent.prototype.generateLabelValues = function () {
        this.labelValues = [];
        this.labelValues.push({ label: 'MRN', valueHtml: this.specification.specificationId });
        this.labelValues.push({ label: 'Name', valueHtml: this.specification.name });
        this.labelValues.push({ label: 'Version', valueHtml: this.specification.version });
    };
    SpecificationUpdateComponent.prototype.setStatus = function (status) {
        this.status = status;
        this.setFormChanged();
    };
    SpecificationUpdateComponent.prototype.generateForm = function () {
        var _this = this;
        this.updateForm = this.formBuilder.group({});
        this.formControlModels = [];
        var formControlModel;
        var disableStatus = this.xml != null || this.doc != null;
        // TODO Get dynamically from XSD
        var statusSelect = [{ label: "provisional", value: "provisional", isSelected: false },
            { label: "released", value: "released", isSelected: false }, { label: "deprecated", value: "deprecated", isSelected: false },
            { label: "deleted", value: "deleted", isSelected: false }];
        statusSelect.forEach(function (status) { if (status.value === _this.status)
            status.isSelected = true; });
        if (disableStatus) {
            formControlModel = { selectValues: statusSelect, showCheckmark: false, formGroup: this.updateForm, elementId: 'status', controlType: mcFormControlModel_1.McFormControlType.Select, labelName: 'Status', placeholder: '', isDisabled: disableStatus };
        }
        else {
            formControlModel = { selectValues: statusSelect, showCheckmark: false, formGroup: this.updateForm, elementId: 'status', controlType: mcFormControlModel_1.McFormControlType.Select, labelName: 'Status', placeholder: '' };
        }
        var formControl = new forms_1.FormControl(this.status, formControlModel.validator);
        formControl.valueChanges.subscribe(function (param) { return _this.setStatus(param); });
        this.updateForm.addControl(formControlModel.elementId, formControl);
        this.formControlModels.push(formControlModel);
    };
    __decorate([
        core_1.ViewChild('uploadXml'), 
        __metadata('design:type', (typeof (_a = typeof mcFileUploader_component_1.McFileUploader !== 'undefined' && mcFileUploader_component_1.McFileUploader) === 'function' && _a) || Object)
    ], SpecificationUpdateComponent.prototype, "fileUploadXml", void 0);
    SpecificationUpdateComponent = __decorate([
        core_1.Component({
            selector: 'specification-update',
            encapsulation: core_1.ViewEncapsulation.None,
            template: __webpack_require__("./src/app/pages/org-service-registry/specifications/components/specification-update/specification-update.html"),
            styles: []
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof organizations_service_1.OrganizationsService !== 'undefined' && organizations_service_1.OrganizationsService) === 'function' && _b) || Object, (typeof (_c = typeof sr_view_model_service_1.SrViewModelService !== 'undefined' && sr_view_model_service_1.SrViewModelService) === 'function' && _c) || Object, (typeof (_d = typeof forms_1.FormBuilder !== 'undefined' && forms_1.FormBuilder) === 'function' && _d) || Object, (typeof (_e = typeof specification_xml_parser_service_1.SpecificationXmlParser !== 'undefined' && specification_xml_parser_service_1.SpecificationXmlParser) === 'function' && _e) || Object, (typeof (_f = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _f) || Object, (typeof (_g = typeof router_1.ActivatedRoute !== 'undefined' && router_1.ActivatedRoute) === 'function' && _g) || Object, (typeof (_h = typeof navigation_helper_service_1.NavigationHelperService !== 'undefined' && navigation_helper_service_1.NavigationHelperService) === 'function' && _h) || Object, (typeof (_j = typeof mc_notifications_service_1.MCNotificationsService !== 'undefined' && mc_notifications_service_1.MCNotificationsService) === 'function' && _j) || Object, (typeof (_k = typeof specifications_service_1.SpecificationsService !== 'undefined' && specifications_service_1.SpecificationsService) === 'function' && _k) || Object])
    ], SpecificationUpdateComponent);
    return SpecificationUpdateComponent;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
}());
exports.SpecificationUpdateComponent = SpecificationUpdateComponent;


/***/ },

/***/ "./src/app/pages/org-service-registry/specifications/components/specification-update/specification-update.html":
/***/ function(module, exports) {

module.exports = "<div class=\"row\">\n  <div class=\"col-lg-12\">\n    <ba-card title=\"Update Specification - {{specification?.name}}\" baCardClass=\"with-scroll table-panel\">\n      <h5>Updating Specification</h5>\n      <mc-label-value-table [isLoading]=\"isLoading\" [labelValues]=\"labelValues\"></mc-label-value-table>\n\n      <div class=\"separator\"></div>\n\n      <div *ngIf=\"specification\">\n        <div class=\"important-notice-big\">\n          If only the <span>status</span> needs to be updated, leave the <span>XML</span> and <span>Document</span> fields empty.<br>\n          <br>\n          If a new XML-file is uploaded the <span>status</span> will be parsed from the XML.\n        </div>\n        <div class=\"separator\"></div>\n        <form>\n          <mc-file-uploader #uploadXml [caption]=\"captionXml\" [fileUploadType]=\"fileTypeXml\" (onUpload)=\"onUploadXml($event)\"></mc-file-uploader>\n          <mc-file-uploader [caption]=\"captionDoc\" [fileUploadType]=\"fileTypeDoc\" (onUpload)=\"onUploadDoc($event)\"></mc-file-uploader>\n          <div *ngIf=\"hasError\" class=\"error-notice\" [innerHTML]=\"errorText | undefined | sanitizeHtml\"></div>\n          <mc-form [isFormValid]=\"isFormChanged\" [formGroup]=\"updateForm\" [formControlModels]=\"formControlModels\" [isLoading]=\"isLoading\" [isRegistering]=\"isUpdating\" [registerTitle]=\"updateTitle\" (onCancel)=\"cancel()\" (onRegister)=\"update()\"></mc-form>\n        </form>\n\n        <div class=\"separator\"></div>\n\n        <mc-label-value-table [isLoading]=\"false\" [labelValues]=\"labelValuesParsed\"></mc-label-value-table>\n      </div>\n      <div class=\"no-data\" *ngIf=\"!specification && !isLoading\">No data</div>\n    </ba-card>\n  </div>\n</div>\n"

/***/ },

/***/ "./src/app/pages/org-service-registry/specifications/specifications.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var SpecificationsComponent = (function () {
    function SpecificationsComponent() {
    }
    SpecificationsComponent = __decorate([
        core_1.Component({
            selector: 'specifications',
            template: "<router-outlet></router-outlet>"
        }), 
        __metadata('design:paramtypes', [])
    ], SpecificationsComponent);
    return SpecificationsComponent;
}());
exports.SpecificationsComponent = SpecificationsComponent;


/***/ },

/***/ "./src/app/pages/org-service-registry/specifications/specifications.module.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var common_1 = __webpack_require__("./node_modules/@angular/common/index.js");
var specifications_routing_1 = __webpack_require__("./src/app/pages/org-service-registry/specifications/specifications.routing.ts");
var specifications_component_1 = __webpack_require__("./src/app/pages/org-service-registry/specifications/specifications.component.ts");
var specification_list_component_1 = __webpack_require__("./src/app/pages/org-service-registry/specifications/components/specification-list/specification-list.component.ts");
var specification_details_component_1 = __webpack_require__("./src/app/pages/org-service-registry/specifications/components/specification-details/specification-details.component.ts");
var nga_module_1 = __webpack_require__("./src/app/theme/nga.module.ts");
var shared_module_1 = __webpack_require__("./src/app/pages/shared/shared.module.ts");
var specification_new_component_1 = __webpack_require__("./src/app/pages/org-service-registry/specifications/components/specification-new/specification-new.component.ts");
var specification_update_component_1 = __webpack_require__("./src/app/pages/org-service-registry/specifications/components/specification-update/specification-update.component.ts");
var SpecificationsModule = (function () {
    function SpecificationsModule() {
    }
    SpecificationsModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                nga_module_1.NgaModule,
                shared_module_1.SharedModule,
                specifications_routing_1.routing
            ],
            declarations: [
                specifications_component_1.SpecificationsComponent,
                specification_details_component_1.SpecificationDetailsComponent,
                specification_list_component_1.SpecificationListComponent,
                specification_new_component_1.SpecificationNewComponent,
                specification_update_component_1.SpecificationUpdateComponent
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], SpecificationsModule);
    return SpecificationsModule;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SpecificationsModule;


/***/ },

/***/ "./src/app/pages/org-service-registry/specifications/specifications.routing.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var specifications_component_1 = __webpack_require__("./src/app/pages/org-service-registry/specifications/specifications.component.ts");
var specification_list_component_1 = __webpack_require__("./src/app/pages/org-service-registry/specifications/components/specification-list/specification-list.component.ts");
var specification_details_component_1 = __webpack_require__("./src/app/pages/org-service-registry/specifications/components/specification-details/specification-details.component.ts");
var specification_new_component_1 = __webpack_require__("./src/app/pages/org-service-registry/specifications/components/specification-new/specification-new.component.ts");
var specification_update_component_1 = __webpack_require__("./src/app/pages/org-service-registry/specifications/components/specification-update/specification-update.component.ts");
// noinspection TypeScriptValidateTypes
var routes = [
    {
        path: 'specifications',
        component: specifications_component_1.SpecificationsComponent,
        data: { breadcrumb: 'Specifications' },
        children: [
            {
                path: '',
                component: specification_list_component_1.SpecificationListComponent
            },
            {
                path: 'register',
                component: specification_new_component_1.SpecificationNewComponent,
                data: { breadcrumb: 'Register' }
            },
            {
                path: ':id',
                component: specification_details_component_1.SpecificationDetailsComponent,
                data: { breadcrumb: 'Details' }
            },
            {
                path: 'update/:id',
                component: specification_update_component_1.SpecificationUpdateComponent,
                data: { breadcrumb: 'Update' }
            }
        ]
    }
];
exports.routing = router_1.RouterModule.forChild(routes);


/***/ },

/***/ "./src/app/pages/org-service-registry/sr-how-to/sr-how-to.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var file_helper_service_1 = __webpack_require__("./src/app/shared/file-helper.service.ts");
var xsds_service_1 = __webpack_require__("./src/app/backend-api/service-registry/services/xsds.service.ts");
var mc_notifications_service_1 = __webpack_require__("./src/app/shared/mc-notifications.service.ts");
var SrHowToComponent = (function () {
    function SrHowToComponent(notifications, xsdsService, fileHelperService) {
        this.notifications = notifications;
        this.xsdsService = xsdsService;
        this.fileHelperService = fileHelperService;
    }
    SrHowToComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.xsdsService.getXsds().subscribe(function (xsds) {
            _this.xsds = xsds;
        }, function (err) {
            _this.notifications.generateNotification('Error', 'Error when trying to get the XSDs', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    SrHowToComponent.prototype.download = function (xsd) {
        this.fileHelperService.downloadBase64File(xsd.content, xsd.contentContentType, xsd.name);
    };
    SrHowToComponent = __decorate([
        core_1.Component({
            selector: 'sr-how-to',
            encapsulation: core_1.ViewEncapsulation.None,
            styles: [],
            template: __webpack_require__("./src/app/pages/org-service-registry/sr-how-to/sr-how-to.html")
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof mc_notifications_service_1.MCNotificationsService !== 'undefined' && mc_notifications_service_1.MCNotificationsService) === 'function' && _a) || Object, (typeof (_b = typeof xsds_service_1.XsdsService !== 'undefined' && xsds_service_1.XsdsService) === 'function' && _b) || Object, (typeof (_c = typeof file_helper_service_1.FileHelperService !== 'undefined' && file_helper_service_1.FileHelperService) === 'function' && _c) || Object])
    ], SrHowToComponent);
    return SrHowToComponent;
    var _a, _b, _c;
}());
exports.SrHowToComponent = SrHowToComponent;


/***/ },

/***/ "./src/app/pages/org-service-registry/sr-how-to/sr-how-to.html":
/***/ function(module, exports) {

module.exports = "<div class=\"row\">\n  <div class=\"col-lg-12\">\n    <ba-card title=\"Service Registry - How to?\" baCardClass=\"with-scroll table-panel\">\n      <h5 style=\"margin-bottom: 2px;\">Guide on how to make services for the Maritime Connectivity Platform - Concepts and how to:</h5>\n      <a href=\"http://maritimeconnectivity.net/docs/Service_Documentation_Guidelines.pdf\" class=\"learn-more\" target=\"_blank\">Service Specification Guideline</a>\n\n      <h5 style=\"margin-bottom: 2px; margin-top: 15px\">TEMPLATES:</h5>\n      <a href=\"http://maritimeconnectivity.net/docs/Service_Specification_Template.docx\" class=\"learn-more\" target=\"_blank\">Download Specification template</a>\n      <BR/>\n      <a href=\"http://maritimeconnectivity.net/docs/Service_Design_Description_Template.docx\" class=\"learn-more\" target=\"_blank\">Download Technical Design template</a>\n      <BR/>\n      <a href=\"http://maritimeconnectivity.net/docs/Service_Instance_Description_Template.docx\" class=\"learn-more\" target=\"_blank\">Download Instance template</a>\n      <div *ngIf=\"xsds && xsds.length>0\">\n        <h5 style=\"margin-bottom: 2px; margin-top: 15px\">XSDs:</h5>\n        <div *ngFor=\"let xsd of xsds\">\n          <a (click)=\"download(xsd)\" class=\"learn-more\">Download {{xsd.name}}</a>\n          <BR/>\n        </div>\n      </div>\n      <BR/>\n      <BR/>\n      If you have any questions or comments please use the <a href=\"https://groups.google.com/forum/#!forum/maritimeconnectivity\" class=\"learn-more\" target=\"_blank\">Maritime Connectivity Platform Google Group</a>\n    </ba-card>\n    <ba-card title=\"MCP - versions\" baCardClass=\"with-scroll table-panel\">\n      <mcp-versions-view></mcp-versions-view>\n    </ba-card>\n  </div>\n</div>\n"

/***/ },

/***/ "./src/app/pages/org-service-registry/sr-how-to/sr-how-to.module.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var common_1 = __webpack_require__("./node_modules/@angular/common/index.js");
var sr_how_to_routing_1 = __webpack_require__("./src/app/pages/org-service-registry/sr-how-to/sr-how-to.routing.ts");
var sr_how_to_component_1 = __webpack_require__("./src/app/pages/org-service-registry/sr-how-to/sr-how-to.component.ts");
var shared_module_1 = __webpack_require__("./src/app/pages/shared/shared.module.ts");
var nga_module_1 = __webpack_require__("./src/app/theme/nga.module.ts");
var SrHowToModule = (function () {
    function SrHowToModule() {
    }
    SrHowToModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                shared_module_1.SharedModule,
                nga_module_1.NgaModule,
                sr_how_to_routing_1.routing
            ],
            declarations: [
                sr_how_to_component_1.SrHowToComponent
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], SrHowToModule);
    return SrHowToModule;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SrHowToModule;


/***/ },

/***/ "./src/app/pages/org-service-registry/sr-how-to/sr-how-to.routing.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var sr_how_to_component_1 = __webpack_require__("./src/app/pages/org-service-registry/sr-how-to/sr-how-to.component.ts");
// noinspection TypeScriptValidateTypes
var routes = [
    {
        path: 'howto',
        component: sr_how_to_component_1.SrHowToComponent,
        data: { breadcrumb: 'How To?' },
        children: []
    }
];
exports.routing = router_1.RouterModule.forChild(routes);


/***/ },

/***/ "./src/app/pages/shared/components/certificate-issue-new/certificate-issue-new.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var mc_notifications_service_1 = __webpack_require__("./src/app/shared/mc-notifications.service.ts");
var navigation_helper_service_1 = __webpack_require__("./src/app/shared/navigation-helper.service.ts");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var certificates_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/certificates.service.ts");
var file_helper_service_1 = __webpack_require__("./src/app/shared/file-helper.service.ts");
var app_constants_1 = __webpack_require__("./src/app/shared/app.constants.ts");
var CertificationRequest_1 = __webpack_require__("./node_modules/pkijs/src/CertificationRequest.js");
var AttributeTypeAndValue_1 = __webpack_require__("./node_modules/pkijs/src/AttributeTypeAndValue.js");
var asn1js_1 = __webpack_require__("./node_modules/asn1js/build/asn1.js");
var pvtsutils_1 = __webpack_require__("./node_modules/pvtsutils/build/index.js");
var CertificateIssueNewComponent = (function () {
    function CertificateIssueNewComponent(fileHelper, certificateService, route, navigationHelper, notificationService) {
        this.fileHelper = fileHelper;
        this.certificateService = certificateService;
        this.route = route;
        this.navigationHelper = navigationHelper;
        this.notificationService = notificationService;
    }
    CertificateIssueNewComponent.prototype.ngOnInit = function () {
        this.isLoading = false;
        var entityType = this.route.snapshot.queryParams[navigation_helper_service_1.queryKeys.ENTITY_TYPE];
        var entityMrn = this.route.snapshot.queryParams[navigation_helper_service_1.queryKeys.ENTITY_MRN];
        var entityTitle = this.route.snapshot.queryParams[navigation_helper_service_1.queryKeys.ENTITY_TITLE];
        if (entityType == null || !entityMrn || !entityTitle) {
            this.notificationService.generateNotification("Error", "Unresolved state when trying to issue new certificate", mc_notifications_service_1.MCNotificationType.Error);
            this.navigationHelper.takeMeHome();
        }
        this.entityMrn = entityMrn;
        this.entityTitle = entityTitle;
        this.entityType = +entityType; // +-conversion from string to int
        this.generateLabelValues();
    };
    CertificateIssueNewComponent.prototype.zipAndDownload = function () {
        this.fileHelper.downloadPemCertificate(this.pemCertificate, this.entityTitle);
    };
    CertificateIssueNewComponent.prototype.issueNew = function () {
        var _this = this;
        this.isLoading = true;
        var ecKeyGenParams = { name: "ECDSA", namedCurve: "P-384", typedCurve: "" };
        var keyResult = crypto.subtle.generateKey(ecKeyGenParams, true, ["sign", "verify"]);
        keyResult.then(function (keyPair) {
            var csr = new CertificationRequest_1.default();
            csr.subject.typesAndValues.push(new AttributeTypeAndValue_1.default({
                type: "2.5.4.3",
                value: new asn1js_1.PrintableString({ value: "Test" })
            }));
            csr.subjectPublicKeyInfo.importKey(keyPair.publicKey).then(function () {
                csr.sign(keyPair.privateKey, "SHA-384").then(function () {
                    var csrBytes = csr.toSchema().toBER(false);
                    var pemCsr = _this.toPem(csrBytes, "CERTIFICATE REQUEST");
                    _this.certificateService.issueNewCertificate(pemCsr, _this.entityType, _this.entityMrn).subscribe(function (certificateBundle) {
                        crypto.subtle.exportKey("pkcs8", keyPair.privateKey).then(function (rawPrivKey) {
                            crypto.subtle.exportKey("spki", keyPair.publicKey).then(function (rawPubKey) {
                                _this.pemCertificate = {
                                    certificate: certificateBundle,
                                    privateKey: _this.toPem(rawPrivKey, "PRIVATE KEY"),
                                    publicKey: _this.toPem(rawPubKey, "PUBLIC KEY")
                                };
                                _this.isLoading = false;
                            }, function (err) {
                                console.error("Public key could not be exported", err);
                                _this.isLoading = false;
                            });
                        }, function (err) {
                            console.error("Private key could not be exported", err);
                            _this.isLoading = false;
                        });
                    }, function (err) {
                        _this.isLoading = false;
                        _this.notificationService.generateNotification('Error', 'Error when trying to issue new certificate', mc_notifications_service_1.MCNotificationType.Error, err);
                    });
                });
            });
        }, function (err) {
            _this.isLoading = false;
            _this.notificationService.generateNotification('Error', 'Error when trying to issue new certificate', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    CertificateIssueNewComponent.prototype.cancel = function () {
        this.navigationHelper.cancelNavigateCertificates();
    };
    CertificateIssueNewComponent.prototype.generateLabelValues = function () {
        this.labelValues = [];
        this.labelValues.push({ label: 'Name', valueHtml: this.entityTitle });
        this.labelValues.push({ label: 'MRN', valueHtml: this.entityMrn.split(app_constants_1.TOKEN_DELIMITER)[0] });
    };
    CertificateIssueNewComponent.prototype.toPem = function (arrayBuffer, type) {
        var b64 = pvtsutils_1.Convert.ToBase64(arrayBuffer);
        var finalString = '';
        while (b64.length > 0) {
            finalString += b64.substring(0, 64) + '\n';
            b64 = b64.substring(64);
        }
        return "-----BEGIN " + type + "-----\n" + finalString + "-----END " + type + "-----\n";
    };
    CertificateIssueNewComponent = __decorate([
        core_1.Component({
            selector: 'certificate-issue-new',
            encapsulation: core_1.ViewEncapsulation.None,
            template: __webpack_require__("./src/app/pages/shared/components/certificate-issue-new/certificate-issue-new.html"),
            styles: []
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof file_helper_service_1.FileHelperService !== 'undefined' && file_helper_service_1.FileHelperService) === 'function' && _a) || Object, (typeof (_b = typeof certificates_service_1.CertificatesService !== 'undefined' && certificates_service_1.CertificatesService) === 'function' && _b) || Object, (typeof (_c = typeof router_1.ActivatedRoute !== 'undefined' && router_1.ActivatedRoute) === 'function' && _c) || Object, (typeof (_d = typeof navigation_helper_service_1.NavigationHelperService !== 'undefined' && navigation_helper_service_1.NavigationHelperService) === 'function' && _d) || Object, (typeof (_e = typeof mc_notifications_service_1.MCNotificationsService !== 'undefined' && mc_notifications_service_1.MCNotificationsService) === 'function' && _e) || Object])
    ], CertificateIssueNewComponent);
    return CertificateIssueNewComponent;
    var _a, _b, _c, _d, _e;
}());
exports.CertificateIssueNewComponent = CertificateIssueNewComponent;


/***/ },

/***/ "./src/app/pages/shared/components/certificate-issue-new/certificate-issue-new.html":
/***/ function(module, exports) {

module.exports = "<div class=\"row\">\n  <div class=\"col-lg-12\">\n    <ba-card title=\"Issue new certificate\" baCardClass=\"with-scroll table-panel\">\n      <!-- Before issue -->\n      <div *ngIf=\"entityType != null && !pemCertificate && !isLoading\">\n        <h5>Issuing a new certificate for:</h5>\n        <mc-label-value-table [isLoading]=\"isLoading\" [labelValues]=\"labelValues\"></mc-label-value-table>\n        <ul *ngIf=\"entityType != null\" class=\"btn-list clearfix\">\n          <li>\n            <button type=\"button\" class=\"btn btn-danger btn-raised\" (click)=\"issueNew()\">Issue Certificate</button>\n          </li>\n          <li>\n            <button type=\"button\" class=\"btn btn-default btn-raised\" (click)=\"cancel()\">Cancel</button>\n          </li>\n        </ul>\n      </div>\n\n      <sk-fading-circle [isRunning]=\"isLoading\" ></sk-fading-circle>\n\n      <!-- After issue and success -->\n      <div *ngIf=\"pemCertificate\">\n        Certificate issued with success\n        <ul *ngIf=\"entityType != null\" class=\"btn-list clearfix\">\n          <li>\n            <button type=\"button\" class=\"btn btn-primary btn-raised\" (click)=\"zipAndDownload()\">Download certificate</button>\n          </li>\n          <li>\n            <button type=\"button\" class=\"btn btn-default btn-raised\" (click)=\"cancel()\">OK</button>\n          </li>\n        </ul>\n      </div>\n    </ba-card>\n  </div>\n</div>\n"

/***/ },

/***/ "./src/app/pages/shared/components/certificate-revoke/certificate-revoke.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var mc_notifications_service_1 = __webpack_require__("./src/app/shared/mc-notifications.service.ts");
var navigation_helper_service_1 = __webpack_require__("./src/app/shared/navigation-helper.service.ts");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var certificate_helper_service_1 = __webpack_require__("./src/app/pages/shared/services/certificate-helper.service.ts");
var certificates_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/certificates.service.ts");
var forms_1 = __webpack_require__("./node_modules/@angular/forms/index.js");
var mcFormControlModel_1 = __webpack_require__("./src/app/theme/components/mcForm/mcFormControlModel.ts");
var select_validator_1 = __webpack_require__("./src/app/theme/validators/select.validator.ts");
var CertificateRevokeComponent = (function () {
    function CertificateRevokeComponent(certificateHelper, formBuilder, certificateService, route, navigationHelper, notificationService) {
        this.certificateHelper = certificateHelper;
        this.formBuilder = formBuilder;
        this.certificateService = certificateService;
        this.route = route;
        this.navigationHelper = navigationHelper;
        this.notificationService = notificationService;
        this.isRevoking = false;
        this.revokeTitle = "Revoke";
    }
    CertificateRevokeComponent.prototype.ngOnInit = function () {
        this.isLoading = true;
        var entityType = this.route.snapshot.queryParams[navigation_helper_service_1.queryKeys.ENTITY_TYPE];
        var entityMrn = this.route.snapshot.queryParams[navigation_helper_service_1.queryKeys.ENTITY_MRN];
        var entityTitle = this.route.snapshot.queryParams[navigation_helper_service_1.queryKeys.ENTITY_TITLE];
        var certificateId = this.route.snapshot.queryParams[navigation_helper_service_1.queryKeys.CERT_ID];
        if (entityType == null || !entityMrn || !entityTitle) {
            this.notificationService.generateNotification("Error", "Unresolved state when trying to revoke certificate", mc_notifications_service_1.MCNotificationType.Error);
            this.navigationHelper.takeMeHome();
        }
        this.entityMrn = entityMrn;
        this.entityTitle = entityTitle;
        this.entityType = +entityType; // +-conversion from string to int
        this.certificateId = certificateId;
        this.generateLabelValues();
        this.generateForm();
        this.isLoading = false;
    };
    CertificateRevokeComponent.prototype.revoke = function () {
        var _this = this;
        this.isRevoking = true;
        var revokeDate = this.revokeForm.value.revokedAt;
        var tempRevocationReason = this.revokeForm.value.revocationReason;
        var revocationReason = null;
        if (tempRevocationReason && tempRevocationReason.toLowerCase().indexOf('undefined') < 0) {
            revocationReason = tempRevocationReason;
        }
        var certificateRevocation = { revokationReason: revocationReason, revokedAt: revokeDate.getTime() + '' };
        this.certificateService.revokeCertificate(this.entityType, this.entityMrn, this.certificateId, certificateRevocation).subscribe(function (_) {
            _this.isRevoking = false;
            _this.navigationHelper.cancelNavigateCertificates();
        }, function (err) {
            _this.isRevoking = false;
            _this.notificationService.generateNotification('Error', 'Error when trying to revoke certificate', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    CertificateRevokeComponent.prototype.cancel = function () {
        this.navigationHelper.cancelNavigateCertificates();
    };
    CertificateRevokeComponent.prototype.generateLabelValues = function () {
        this.labelValues = [];
        this.labelValues.push({ label: 'Name', valueHtml: this.entityTitle });
        this.labelValues.push({ label: 'MRN', valueHtml: this.entityMrn });
    };
    CertificateRevokeComponent.prototype.generateForm = function () {
        this.revokeForm = this.formBuilder.group({});
        this.formControlModels = [];
        var selectValues = this.selectValues();
        var formControlModelSelect = { selectValues: selectValues, formGroup: this.revokeForm, elementId: 'revocationReason', controlType: mcFormControlModel_1.McFormControlType.Select, labelName: '', placeholder: '', validator: select_validator_1.SelectValidator.validate, showCheckmark: false };
        var formControl = new forms_1.FormControl('', formControlModelSelect.validator);
        this.revokeForm.addControl(formControlModelSelect.elementId, formControl);
        this.formControlModels.push(formControlModelSelect);
        var formControlModel = { minDate: new Date(), formGroup: this.revokeForm, elementId: 'revokedAt', controlType: mcFormControlModel_1.McFormControlType.Datepicker, labelName: '', validator: forms_1.Validators.required };
        formControl = new forms_1.FormControl('', formControlModel.validator);
        this.revokeForm.addControl(formControlModel.elementId, formControl);
        this.formControlModels.push(formControlModel);
    };
    CertificateRevokeComponent.prototype.selectValues = function () {
        var selectValues = [];
        selectValues.push({ value: undefined, label: 'Choose reason...', isSelected: true });
        var allrevokeTypes = this.certificateHelper.getAllRevocationTypes();
        allrevokeTypes.forEach(function (revokeType) {
            selectValues.push({ value: revokeType.value, label: revokeType.label, isSelected: false });
        });
        return selectValues;
    };
    CertificateRevokeComponent = __decorate([
        core_1.Component({
            selector: 'certificate-revoke',
            encapsulation: core_1.ViewEncapsulation.None,
            template: __webpack_require__("./src/app/pages/shared/components/certificate-revoke/certificate-revoke.html"),
            styles: []
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof certificate_helper_service_1.CertificateHelperService !== 'undefined' && certificate_helper_service_1.CertificateHelperService) === 'function' && _a) || Object, (typeof (_b = typeof forms_1.FormBuilder !== 'undefined' && forms_1.FormBuilder) === 'function' && _b) || Object, (typeof (_c = typeof certificates_service_1.CertificatesService !== 'undefined' && certificates_service_1.CertificatesService) === 'function' && _c) || Object, (typeof (_d = typeof router_1.ActivatedRoute !== 'undefined' && router_1.ActivatedRoute) === 'function' && _d) || Object, (typeof (_e = typeof navigation_helper_service_1.NavigationHelperService !== 'undefined' && navigation_helper_service_1.NavigationHelperService) === 'function' && _e) || Object, (typeof (_f = typeof mc_notifications_service_1.MCNotificationsService !== 'undefined' && mc_notifications_service_1.MCNotificationsService) === 'function' && _f) || Object])
    ], CertificateRevokeComponent);
    return CertificateRevokeComponent;
    var _a, _b, _c, _d, _e, _f;
}());
exports.CertificateRevokeComponent = CertificateRevokeComponent;


/***/ },

/***/ "./src/app/pages/shared/components/certificate-revoke/certificate-revoke.html":
/***/ function(module, exports) {

module.exports = "<div class=\"row\">\n  <div class=\"col-lg-12\">\n    <ba-card title=\"Revoke certificate\" baCardClass=\"with-scroll table-panel\">\n      <!-- Before issue -->\n      <div *ngIf=\"entityType != null && !isLoading\">\n        <h5>Revoking certificate for:</h5>\n        <mc-label-value-table [isLoading]=\"isLoading\" [labelValues]=\"labelValues\"></mc-label-value-table>\n        <br>\n        <h5>\n          Please choose a reason and date for revocation.\n        </h5>\n        <mc-form [formGroup]=\"revokeForm\" [formControlModels]=\"formControlModels\" [isLoading]=\"isLoading\" [isRegistering]=\"isRevoking\" [registerTitle]=\"revokeTitle\" (onCancel)=\"cancel()\" (onRegister)=\"revoke()\"></mc-form>\n      </div>\n      <sk-fading-circle [isRunning]=\"isLoading\" ></sk-fading-circle>\n    </ba-card>\n  </div>\n</div>\n"

/***/ },

/***/ "./src/app/pages/shared/components/certificates-table/certificates-table.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var certificate_helper_service_1 = __webpack_require__("./src/app/pages/shared/services/certificate-helper.service.ts");
var theme_constants_1 = __webpack_require__("./src/app/theme/theme.constants.ts");
var auth_service_1 = __webpack_require__("./src/app/authentication/services/auth.service.ts");
var navigation_helper_service_1 = __webpack_require__("./src/app/shared/navigation-helper.service.ts");
var mc_notifications_service_1 = __webpack_require__("./src/app/shared/mc-notifications.service.ts");
var file_helper_service_1 = __webpack_require__("./src/app/shared/file-helper.service.ts");
var common_1 = __webpack_require__("./node_modules/@angular/common/index.js");
var CertificatesTableComponent = (function () {
    function CertificatesTableComponent(datePipe, fileHelper, navigationHelper, authService, certificateHelperService, notificationService) {
        this.datePipe = datePipe;
        this.fileHelper = fileHelper;
        this.navigationHelper = navigationHelper;
        this.authService = authService;
        this.certificateHelperService = certificateHelperService;
        this.notificationService = notificationService;
        this.newCertificateTitle = "Issue new Certificate";
        this.onIssueCertificate = this.issueCertificate.bind(this);
    }
    CertificatesTableComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.authService.authState.rolesLoaded) {
            this.authService.rolesLoaded.subscribe(function (mode) {
                _this.generateHeadersAndRows();
            });
        }
    };
    CertificatesTableComponent.prototype.ngOnChanges = function () {
        if (this.certificates) {
            this.certificateViewModels = this.certificateHelperService.convertCertificatesToViewModels(this.certificates);
            this.sortCertificates();
            this.generateHeadersAndRows();
        }
    };
    CertificatesTableComponent.prototype.generateHeadersAndRows = function () {
        var _this = this;
        var tableHeaders = [];
        var tableRows = [];
        var tableHeader = { title: 'Certificate', class: '' };
        tableHeaders.push(tableHeader);
        tableHeader = { title: 'Valid from', class: 'nowrap' };
        tableHeaders.push(tableHeader);
        tableHeader = { title: 'Valid to', class: 'nowrap' };
        tableHeaders.push(tableHeader);
        tableHeader = { title: '', class: 'table-buttons' };
        tableHeaders.push(tableHeader);
        var _loop_1 = function(certificate) {
            cells = [];
            tableCell = { valueHtml: 'Certificate for ' + this_1.certificateTitle, class: '', truncateNumber: 50 };
            cells.push(tableCell);
            tableCell = { valueHtml: this_1.datePipe.transform(certificate.start, theme_constants_1.DATE_FORMAT), class: 'nowrap', truncateNumber: 0 };
            cells.push(tableCell);
            tableCell = { valueHtml: this_1.datePipe.transform(certificate.end, theme_constants_1.DATE_FORMAT), class: 'nowrap', truncateNumber: 0 };
            cells.push(tableCell);
            if (certificate.revoked) {
                tableCell = { valueHtml: 'Revoked (' + certificate.revokeReasonText + ')', class: 'red-text', truncateNumber: 50 };
                cells.push(tableCell);
            }
            else {
                var actionButtons = [];
                var actionButton = { buttonClass: 'btn btn-primary btn-raised btn-sm', name: 'Download certificate', onClick: function () { _this.download(certificate); } };
                actionButtons.push(actionButton);
                if (this_1.isAdmin) {
                    actionButton = { buttonClass: 'btn btn-primary btn-raised btn-sm', name: 'Revoke certificate', onClick: function () { _this.revoke(certificate); } };
                    actionButtons.push(actionButton);
                }
                var tableCellActionButtons = { valueHtml: '', class: 'table-buttons', truncateNumber: 0, actionButtons: actionButtons };
                cells.push(tableCellActionButtons);
            }
            var tableRow = { cells: cells };
            tableRows.push(tableRow);
        };
        var this_1 = this;
        var cells, tableCell;
        for (var _i = 0, _a = this.certificateViewModels; _i < _a.length; _i++) {
            var certificate = _a[_i];
            _loop_1(certificate);
        }
        this.tableHeaders = tableHeaders;
        this.tableRows = tableRows;
    };
    CertificatesTableComponent.prototype.sortCertificates = function () {
        // We are sorting with longest due date on top
        this.certificateViewModels.sort(function (obj1, obj2) {
            var obj1Time;
            var obj2Time;
            // Why is this needed??? for some reason sometimes the obj.end is a number and not a Date???
            if (typeof obj1.end === "Date") {
                obj1Time = obj1.end.getTime();
            }
            else {
                obj1Time = obj1.end;
            }
            if (typeof obj2.end === "Date") {
                obj2Time = obj2.end.getTime();
            }
            else {
                obj2Time = obj2.end;
            }
            if (obj1.revoked && obj2.revoked) {
                return obj2Time - obj1Time;
            }
            if (obj1.revoked) {
                return 1;
            }
            if (obj2.revoked) {
                return -1;
            }
            return obj2Time - obj1Time;
        });
    };
    CertificatesTableComponent.prototype.issueCertificate = function () {
        this.navigationHelper.navigateToIssueNewCertificate(this.certificateEntityType, this.entityMrn, this.certificateTitle);
    };
    CertificatesTableComponent.prototype.revoke = function (certificate) {
        this.navigationHelper.navigateToRevokeCertificate(this.certificateEntityType, this.entityMrn, this.certificateTitle, certificate.serialNumber);
    };
    CertificatesTableComponent.prototype.download = function (certificate) {
        var pemCertificate = { certificate: certificate.certificate };
        var certBundle = { pemCertificate: pemCertificate };
        this.fileHelper.downloadPemCertificate(certBundle, this.certificateTitle);
    };
    CertificatesTableComponent.prototype.canCreate = function () {
        return this.isAdmin;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], CertificatesTableComponent.prototype, "certificates", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', (typeof (_a = typeof certificate_helper_service_1.CertificateEntityType !== 'undefined' && certificate_helper_service_1.CertificateEntityType) === 'function' && _a) || Object)
    ], CertificatesTableComponent.prototype, "certificateEntityType", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], CertificatesTableComponent.prototype, "entityMrn", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], CertificatesTableComponent.prototype, "isLoading", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], CertificatesTableComponent.prototype, "certificateTitle", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], CertificatesTableComponent.prototype, "isAdmin", void 0);
    CertificatesTableComponent = __decorate([
        core_1.Component({
            selector: 'certificates-table',
            encapsulation: core_1.ViewEncapsulation.None,
            template: __webpack_require__("./src/app/pages/shared/components/certificates-table/certificates-table.html"),
            styles: [__webpack_require__("./src/app/pages/shared/components/certificates-table/certificates-table.scss")]
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof common_1.DatePipe !== 'undefined' && common_1.DatePipe) === 'function' && _b) || Object, (typeof (_c = typeof file_helper_service_1.FileHelperService !== 'undefined' && file_helper_service_1.FileHelperService) === 'function' && _c) || Object, (typeof (_d = typeof navigation_helper_service_1.NavigationHelperService !== 'undefined' && navigation_helper_service_1.NavigationHelperService) === 'function' && _d) || Object, (typeof (_e = typeof auth_service_1.AuthService !== 'undefined' && auth_service_1.AuthService) === 'function' && _e) || Object, (typeof (_f = typeof certificate_helper_service_1.CertificateHelperService !== 'undefined' && certificate_helper_service_1.CertificateHelperService) === 'function' && _f) || Object, (typeof (_g = typeof mc_notifications_service_1.MCNotificationsService !== 'undefined' && mc_notifications_service_1.MCNotificationsService) === 'function' && _g) || Object])
    ], CertificatesTableComponent);
    return CertificatesTableComponent;
    var _a, _b, _c, _d, _e, _f, _g;
}());
exports.CertificatesTableComponent = CertificatesTableComponent;


/***/ },

/***/ "./src/app/pages/shared/components/certificates-table/certificates-table.html":
/***/ function(module, exports) {

module.exports = "<mc-table [tableHeaders]=\"tableHeaders\" [tableRows]=\"tableRows\" [isLoading]=\"isLoading\"></mc-table>\n<div *ngIf=\"!isLoading\">\n  <mc-create-button [isAdmin]=\"canCreate()\" [title]=\"newCertificateTitle\" [onClick]=\"onIssueCertificate\"></mc-create-button>\n</div>\n"

/***/ },

/***/ "./src/app/pages/shared/components/certificates-table/certificates-table.scss":
/***/ function(module, exports) {

module.exports = ".table-buttons {\n  width: 100%; }\n  .table-buttons button {\n    margin: 5px !important; }\n\n.certificate-table td {\n  vertical-align: middle; }\n\n.certificate-table td:first-child {\n  white-space: nowrap; }\n\n.certificate-table-short td {\n  vertical-align: middle; }\n\n.certificate-table-short td:first-child {\n  min-width: 200px; }\n"

/***/ },

/***/ "./src/app/pages/shared/components/designs-table/designs-table.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var mc_notifications_service_1 = __webpack_require__("./src/app/shared/mc-notifications.service.ts");
var organizations_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/organizations.service.ts");
var DesignsTableComponent = (function () {
    function DesignsTableComponent(orgsService, notifications) {
        this.orgsService = orgsService;
        this.notifications = notifications;
    }
    DesignsTableComponent.prototype.ngOnInit = function () {
    };
    DesignsTableComponent.prototype.ngOnChanges = function () {
        if (this.designs) {
            this.generateHeadersAndRows();
        }
    };
    DesignsTableComponent.prototype.generateHeadersAndRows = function () {
        var tableHeaders = [];
        var tableRows = [];
        var tableHeader = { title: 'Name', class: '' };
        tableHeaders.push(tableHeader);
        tableHeader = { title: 'Version', class: 'nowrap align-center' };
        tableHeaders.push(tableHeader);
        tableHeader = { title: 'Status', class: 'nowrap' };
        tableHeaders.push(tableHeader);
        tableHeader = { title: 'Organization', class: 'nowrap' };
        tableHeaders.push(tableHeader);
        tableHeader = { title: 'Description', class: '' };
        tableHeaders.push(tableHeader);
        for (var _i = 0, _a = this.designs; _i < _a.length; _i++) {
            var design = _a[_i];
            var cells = [];
            var tableCell = { valueHtml: design.name, class: '', truncateNumber: 50 };
            cells.push(tableCell);
            tableCell = { valueHtml: design.version, class: 'nowrap align-center', truncateNumber: 0 };
            cells.push(tableCell);
            tableCell = { valueHtml: design.status, class: 'nowrap', truncateNumber: 0 };
            cells.push(tableCell);
            tableCell = { valueHtml: '', class: 'nowrap', truncateNumber: 30 };
            this.setOrganizationCell(tableCell, design.organizationId);
            cells.push(tableCell);
            tableCell = { valueHtml: design.description, class: 'table-description', truncateNumber: 250 };
            cells.push(tableCell);
            var tableRow = { cells: cells };
            tableRows.push(tableRow);
        }
        this.tableHeaders = tableHeaders;
        this.tableRows = tableRows;
    };
    DesignsTableComponent.prototype.setOrganizationCell = function (tableCell, organizationId) {
        var _this = this;
        this.orgsService.getOrganizationName(organizationId).subscribe(function (organizationName) {
            tableCell.valueHtml = organizationName;
        }, function (err) {
            _this.notifications.generateNotification('Error', 'Error when trying to get organization', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], DesignsTableComponent.prototype, "designs", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], DesignsTableComponent.prototype, "isLoading", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Function)
    ], DesignsTableComponent.prototype, "onRowClick", void 0);
    DesignsTableComponent = __decorate([
        core_1.Component({
            selector: 'designs-table',
            encapsulation: core_1.ViewEncapsulation.None,
            template: __webpack_require__("./src/app/pages/shared/components/designs-table/designs-table.html"),
            styles: []
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof organizations_service_1.OrganizationsService !== 'undefined' && organizations_service_1.OrganizationsService) === 'function' && _a) || Object, (typeof (_b = typeof mc_notifications_service_1.MCNotificationsService !== 'undefined' && mc_notifications_service_1.MCNotificationsService) === 'function' && _b) || Object])
    ], DesignsTableComponent);
    return DesignsTableComponent;
    var _a, _b;
}());
exports.DesignsTableComponent = DesignsTableComponent;


/***/ },

/***/ "./src/app/pages/shared/components/designs-table/designs-table.html":
/***/ function(module, exports) {

module.exports = "<mc-table [tableHeaders]=\"tableHeaders\" [tableRows]=\"tableRows\" [isLoading]=\"isLoading\" [onRowClick]=\"onRowClick\"></mc-table>\n"

/***/ },

/***/ "./src/app/pages/shared/components/endorsed-by-list/endorsed-by-list.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var auth_service_1 = __webpack_require__("./src/app/authentication/services/auth.service.ts");
var rxjs_1 = __webpack_require__("./node_modules/rxjs/Rx.js");
var logo_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/logo.service.ts");
var navigation_helper_service_1 = __webpack_require__("./src/app/shared/navigation-helper.service.ts");
var organizations_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/organizations.service.ts");
var EndorsedByListComponent = (function () {
    function EndorsedByListComponent(logoService, authService, orgService, navigationHelper) {
        this.logoService = logoService;
        this.authService = authService;
        this.orgService = orgService;
        this.navigationHelper = navigationHelper;
    }
    EndorsedByListComponent.prototype.ngOnInit = function () {
        this.cardTitle = this.title;
        this.generateEntityImageList();
    };
    EndorsedByListComponent.prototype.ngOnChanges = function () {
        this.cardTitle = this.title;
        this.generateEntityImageList();
    };
    EndorsedByListComponent.prototype.gotoDetails = function (entityModel) {
        if (this.isMyOrg(entityModel.entityId)) {
            this.navigationHelper.takeMeHome();
        }
        else {
            this.navigationHelper.navigateToOrganizationDetails(entityModel.entityId);
        }
    };
    EndorsedByListComponent.prototype.isMyOrg = function (orgMrn) {
        return this.authService.authState.orgMrn === orgMrn;
    };
    EndorsedByListComponent.prototype.generateEntityImageList = function () {
        var _this = this;
        if (this.endorsements) {
            if (this.endorsements !== this.oldEndorsements) {
                this.oldEndorsements = this.endorsements;
                this.entityImageList = [];
                this.endorsements.forEach(function (endorsement) {
                    var entityImage = { imageSourceObservable: _this.createImgObservable(endorsement.orgMrn), entityId: endorsement.orgMrn, title: endorsement.orgName };
                    _this.entityImageList.push(entityImage);
                });
            }
        }
    };
    EndorsedByListComponent.prototype.createImgObservable = function (orgMrn) {
        var _this = this;
        var imageSrc = 'assets/img/no_organization.png';
        return rxjs_1.Observable.create(function (observer) {
            _this.logoService.getLogoForOrganization(orgMrn).subscribe(function (logo) {
                observer.next(URL.createObjectURL(new Blob([logo])));
            }, function (err) {
                observer.next(imageSrc);
            });
        });
    };
    EndorsedByListComponent.prototype.setRealOrganizationName = function (entityImage, organizationMrn) {
        this.orgService.getOrganizationName(organizationMrn).subscribe(function (organizationName) {
            entityImage.title = organizationName;
        }, function (err) {
            // Do nothing. We already have a name set, which should be correct 99% of the time
        });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], EndorsedByListComponent.prototype, "endorsements", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], EndorsedByListComponent.prototype, "isLoading", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], EndorsedByListComponent.prototype, "title", void 0);
    EndorsedByListComponent = __decorate([
        core_1.Component({
            selector: 'endorsed-by-list',
            encapsulation: core_1.ViewEncapsulation.None,
            template: __webpack_require__("./src/app/pages/shared/components/endorsed-by-list/endorsed-by-list.html"),
            styles: []
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof logo_service_1.LogoService !== 'undefined' && logo_service_1.LogoService) === 'function' && _a) || Object, (typeof (_b = typeof auth_service_1.AuthService !== 'undefined' && auth_service_1.AuthService) === 'function' && _b) || Object, (typeof (_c = typeof organizations_service_1.OrganizationsService !== 'undefined' && organizations_service_1.OrganizationsService) === 'function' && _c) || Object, (typeof (_d = typeof navigation_helper_service_1.NavigationHelperService !== 'undefined' && navigation_helper_service_1.NavigationHelperService) === 'function' && _d) || Object])
    ], EndorsedByListComponent);
    return EndorsedByListComponent;
    var _a, _b, _c, _d;
}());
exports.EndorsedByListComponent = EndorsedByListComponent;


/***/ },

/***/ "./src/app/pages/shared/components/endorsed-by-list/endorsed-by-list.html":
/***/ function(module, exports) {

module.exports = "<div class=\"row\">\n  <div class=\"col-lg-12\">\n    <ba-card title=\"{{cardTitle}}\" baCardClass=\"with-scroll table-panel\">\n      <mc-entity-image-list [noDataText]=\"'None'\" [isLoading]=\"isLoading\" [entityImageList]=\"entityImageList\" (onClick)=\"gotoDetails($event)\"></mc-entity-image-list>\n    </ba-card>\n  </div>\n</div>\n"

/***/ },

/***/ "./src/app/pages/shared/components/instances-table/instances-table.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var mc_notifications_service_1 = __webpack_require__("./src/app/shared/mc-notifications.service.ts");
var organizations_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/organizations.service.ts");
var mc_utils_1 = __webpack_require__("./src/app/shared/mc-utils.ts");
var InstancesTableComponent = (function () {
    function InstancesTableComponent(orgsService, notifications) {
        this.orgsService = orgsService;
        this.notifications = notifications;
    }
    InstancesTableComponent.prototype.ngOnInit = function () {
    };
    InstancesTableComponent.prototype.ngOnChanges = function () {
        if (this.instances) {
            this.generateHeadersAndRows();
        }
    };
    InstancesTableComponent.prototype.generateHeadersAndRows = function () {
        var tableHeaders = [];
        var tableRows = [];
        var tableHeader = { title: 'Name', class: '' };
        tableHeaders.push(tableHeader);
        tableHeader = { title: 'Version', class: 'nowrap align-center' };
        tableHeaders.push(tableHeader);
        tableHeader = { title: 'Status', class: 'nowrap' };
        tableHeaders.push(tableHeader);
        tableHeader = { title: 'Compliant', class: 'nowrap' };
        tableHeaders.push(tableHeader);
        tableHeader = { title: 'Organization', class: 'nowrap' };
        tableHeaders.push(tableHeader);
        tableHeader = { title: 'Service endpoint', class: '' };
        tableHeaders.push(tableHeader);
        tableHeader = { title: 'Description', class: '' };
        tableHeaders.push(tableHeader);
        for (var _i = 0, _a = this.instances; _i < _a.length; _i++) {
            var instance = _a[_i];
            var cells = [];
            var tableCell = { valueHtml: instance.name, class: '', truncateNumber: 45 };
            cells.push(tableCell);
            tableCell = { valueHtml: instance.version, class: 'nowrap align-center', truncateNumber: 0 };
            cells.push(tableCell);
            tableCell = { valueHtml: instance.status, class: 'nowrap', truncateNumber: 0 };
            cells.push(tableCell);
            var compliantClass = instance.compliant ? '' : 'label-danger';
            tableCell = { valueHtml: mc_utils_1.McUtils.getYesNoString(instance.compliant), class: 'nowrap ' + compliantClass, truncateNumber: 0 };
            cells.push(tableCell);
            tableCell = { valueHtml: '', class: 'nowrap', truncateNumber: 25 };
            this.setOrganizationCell(tableCell, instance.organizationId);
            cells.push(tableCell);
            tableCell = { valueHtml: instance.endpointUri, class: 'list-endpoint', truncateNumber: 60 };
            cells.push(tableCell);
            tableCell = { valueHtml: instance.description, class: 'table-description-short', truncateNumber: 150 };
            cells.push(tableCell);
            var tableRow = { cells: cells };
            tableRows.push(tableRow);
        }
        this.tableHeaders = tableHeaders;
        this.tableRows = tableRows;
    };
    InstancesTableComponent.prototype.setOrganizationCell = function (tableCell, organizationId) {
        var _this = this;
        this.orgsService.getOrganizationName(organizationId).subscribe(function (organizationName) {
            tableCell.valueHtml = organizationName;
        }, function (err) {
            _this.notifications.generateNotification('Error', 'Error when trying to get organization', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], InstancesTableComponent.prototype, "instances", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], InstancesTableComponent.prototype, "isLoading", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Function)
    ], InstancesTableComponent.prototype, "onRowClick", void 0);
    InstancesTableComponent = __decorate([
        core_1.Component({
            selector: 'instances-table',
            encapsulation: core_1.ViewEncapsulation.None,
            template: __webpack_require__("./src/app/pages/shared/components/instances-table/instances-table.html"),
            styles: []
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof organizations_service_1.OrganizationsService !== 'undefined' && organizations_service_1.OrganizationsService) === 'function' && _a) || Object, (typeof (_b = typeof mc_notifications_service_1.MCNotificationsService !== 'undefined' && mc_notifications_service_1.MCNotificationsService) === 'function' && _b) || Object])
    ], InstancesTableComponent);
    return InstancesTableComponent;
    var _a, _b;
}());
exports.InstancesTableComponent = InstancesTableComponent;


/***/ },

/***/ "./src/app/pages/shared/components/instances-table/instances-table.html":
/***/ function(module, exports) {

module.exports = "<mc-table [tableHeaders]=\"tableHeaders\" [tableRows]=\"tableRows\" [isLoading]=\"isLoading\" [onRowClick]=\"onRowClick\"></mc-table>\n"

/***/ },

/***/ "./src/app/pages/shared/components/organizaton-details-table/organization-details-table.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var Organization_1 = __webpack_require__("./src/app/backend-api/identity-registry/autogen/model/Organization.ts");
var organization_view_model_service_1 = __webpack_require__("./src/app/pages/shared/services/organization-view-model.service.ts");
var logo_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/logo.service.ts");
var auth_service_1 = __webpack_require__("./src/app/authentication/services/auth.service.ts");
var mc_notifications_service_1 = __webpack_require__("./src/app/shared/mc-notifications.service.ts");
var OrganizationDetailsTableComponent = (function () {
    function OrganizationDetailsTableComponent(authService, logoService, orgViewModelService, notifications) {
        this.authService = authService;
        this.logoService = logoService;
        this.orgViewModelService = orgViewModelService;
        this.notifications = notifications;
        this.displayLogo = true;
        this.onLogoLoaded = new core_1.EventEmitter();
        this.isLoadingOrgAndLogo = true;
        this.uploadingLogo = false;
    }
    OrganizationDetailsTableComponent.prototype.ngOnChanges = function () {
        if (this.organization) {
            this.canChangeLogo = this.canChangeTheLogo();
            this.loadLogo();
        }
    };
    OrganizationDetailsTableComponent.prototype.uploadLogo = function (logo) {
        var _this = this;
        var oldLogo = this.logo;
        this.uploadingLogo = true;
        this.logoService.uploadLogo(this.organization.mrn, logo).subscribe(function (logo) {
            _this.loadLogo();
        }, function (err) {
            _this.logo = oldLogo;
            _this.uploadingLogo = false;
            _this.notifications.generateNotification('Error', 'Error when trying to upload logo', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    OrganizationDetailsTableComponent.prototype.setLabelValues = function () {
        this.labelValues = this.orgViewModelService.generateLabelValuesForOrganization(this.organization);
        this.isLoadingOrgAndLogo = false;
    };
    OrganizationDetailsTableComponent.prototype.loadLogo = function () {
        var _this = this;
        this.logoService.getLogoForOrganization(this.organization.mrn).subscribe(function (logo) {
            _this.logo = URL.createObjectURL(new Blob([logo]));
            _this.setLabelValues();
            _this.uploadingLogo = false;
            _this.onLogoLoaded.emit('');
        }, function (err) {
            if (_this.canChangeTheLogo()) {
                _this.logo = 'assets/img/no_organization.png';
            }
            _this.setLabelValues();
            _this.uploadingLogo = false;
            _this.onLogoLoaded.emit('');
        });
    };
    OrganizationDetailsTableComponent.prototype.canChangeTheLogo = function () {
        return this.authService.authState.hasPermission(auth_service_1.AuthPermission.OrgAdmin);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], OrganizationDetailsTableComponent.prototype, "displayLogo", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], OrganizationDetailsTableComponent.prototype, "isLoading", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', (typeof (_a = typeof Organization_1.Organization !== 'undefined' && Organization_1.Organization) === 'function' && _a) || Object)
    ], OrganizationDetailsTableComponent.prototype, "organization", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', (typeof (_b = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _b) || Object)
    ], OrganizationDetailsTableComponent.prototype, "onLogoLoaded", void 0);
    OrganizationDetailsTableComponent = __decorate([
        core_1.Component({
            selector: 'organization-details-table',
            encapsulation: core_1.ViewEncapsulation.None,
            template: __webpack_require__("./src/app/pages/shared/components/organizaton-details-table/organization-details-table.html"),
            styles: []
        }), 
        __metadata('design:paramtypes', [(typeof (_c = typeof auth_service_1.AuthService !== 'undefined' && auth_service_1.AuthService) === 'function' && _c) || Object, (typeof (_d = typeof logo_service_1.LogoService !== 'undefined' && logo_service_1.LogoService) === 'function' && _d) || Object, (typeof (_e = typeof organization_view_model_service_1.OrganizationViewModelService !== 'undefined' && organization_view_model_service_1.OrganizationViewModelService) === 'function' && _e) || Object, (typeof (_f = typeof mc_notifications_service_1.MCNotificationsService !== 'undefined' && mc_notifications_service_1.MCNotificationsService) === 'function' && _f) || Object])
    ], OrganizationDetailsTableComponent);
    return OrganizationDetailsTableComponent;
    var _a, _b, _c, _d, _e, _f;
}());
exports.OrganizationDetailsTableComponent = OrganizationDetailsTableComponent;


/***/ },

/***/ "./src/app/pages/shared/components/organizaton-details-table/organization-details-table.html":
/***/ function(module, exports) {

module.exports = "<div *ngIf=\"displayLogo && logo\" style=\"margin-bottom: 10px;\">\n  <img class=\"logo-image-no-center\" [attr.src]=\"logo | sanitizeUrl\" *ngIf=\"logo && !canChangeLogo\">\n  <mc-logo-uploader [logo]=\"logo\" [uploadingLogo]=\"uploadingLogo\" (onUpload)=\"uploadLogo($event)\" *ngIf=\"logo && canChangeLogo\"></mc-logo-uploader>\n</div>\n<mc-label-value-table [isLoading]=\"isLoadingOrgAndLogo\" [labelValues]=\"labelValues\"></mc-label-value-table>"

/***/ },

/***/ "./src/app/pages/shared/components/service-details-view/service-details-view.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var Service_1 = __webpack_require__("./src/app/backend-api/identity-registry/autogen/model/Service.ts");
var certificate_helper_service_1 = __webpack_require__("./src/app/pages/shared/services/certificate-helper.service.ts");
var file_helper_service_1 = __webpack_require__("./src/app/shared/file-helper.service.ts");
var auth_service_1 = __webpack_require__("./src/app/authentication/services/auth.service.ts");
var ServiceViewModel_1 = __webpack_require__("./src/app/pages/org-identity-registry/services/view-models/ServiceViewModel.ts");
var mc_notifications_service_1 = __webpack_require__("./src/app/shared/mc-notifications.service.ts");
var id_services_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/id-services.service.ts");
var navigation_helper_service_1 = __webpack_require__("./src/app/shared/navigation-helper.service.ts");
var app_constants_1 = __webpack_require__("./src/app/shared/app.constants.ts");
var instances_service_1 = __webpack_require__("./src/app/backend-api/service-registry/services/instances.service.ts");
var ServiceDetailsViewComponent = (function () {
    function ServiceDetailsViewComponent(fileHelperService, authService, servicesService, notifications, navigationHelperService, instancesService) {
        this.fileHelperService = fileHelperService;
        this.authService = authService;
        this.servicesService = servicesService;
        this.notifications = notifications;
        this.navigationHelperService = navigationHelperService;
        this.instancesService = instancesService;
        this.shouldShowDelete = true;
        this.shouldShowUpdate = true;
        this.shouldShowLinkToInstance = true;
        this.deleteAction = new core_1.EventEmitter();
        this.updateAction = new core_1.EventEmitter();
        this.linkToInstance = false;
        this.isLoadingInstance = false;
    }
    ServiceDetailsViewComponent.prototype.ngOnInit = function () {
        this.isLoadingInstance = true;
        this.entityType = certificate_helper_service_1.CertificateEntityType.Service;
        this.onGotoVessel = this.gotoVessel.bind(this);
        this.onGotoInstance = this.gotoInstance.bind(this);
    };
    ServiceDetailsViewComponent.prototype.ngOnChanges = function () {
        if (this.service) {
            this.entityMrn = this.service.mrn + app_constants_1.TOKEN_DELIMITER + this.service.instanceVersion;
            if (this.shouldShowLinkToInstance) {
                this.loadInstance();
            }
            else {
                this.generateLabelValues();
                this.isLoadingInstance = false;
            }
        }
    };
    ServiceDetailsViewComponent.prototype.loadInstance = function () {
        var _this = this;
        this.instancesService.getInstance(this.service.mrn, this.service.instanceVersion).subscribe(function (instance) {
            _this.linkToInstance = true;
            _this.generateLabelValues();
            _this.isLoadingInstance = false;
        }, function (err) {
            if (err.status == 404) {
                _this.linkToInstance = false;
                _this.generateLabelValues();
            }
            else {
                _this.notifications.generateNotification('Error', 'Error when trying to get the Instance for the ID service', mc_notifications_service_1.MCNotificationType.Error, err);
            }
            _this.isLoadingInstance = false;
        });
    };
    ServiceDetailsViewComponent.prototype.showDownload = function () {
        return this.service.oidcClientId && this.isAdmin();
    };
    ServiceDetailsViewComponent.prototype.downloadXML = function () {
        var _this = this;
        this.servicesService.getIdServiceJbossXml(this.service.mrn, this.service.instanceVersion).subscribe(function (xmlString) {
            _this.fileHelperService.downloadFile(xmlString, 'text/xml', 'keycloak-oidc-subsystem.xml');
        }, function (err) {
            _this.isLoading = false;
            _this.notifications.generateNotification('Error', 'Error when trying to download the XML', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    ServiceDetailsViewComponent.prototype.downloadJSON = function () {
        var _this = this;
        this.servicesService.getServiceKeycloakJson(this.service.mrn, this.service.instanceVersion).subscribe(function (jsonString) {
            _this.fileHelperService.downloadFile(jsonString, 'text/json', 'keycloak.json');
        }, function (err) {
            _this.isLoading = false;
            _this.notifications.generateNotification('Error', 'Error when trying to download the JSON', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    ServiceDetailsViewComponent.prototype.generateLabelValues = function () {
        this.labelValues = [];
        if (this.service) {
            this.labelValues.push({ label: 'MRN', valueHtml: this.service.mrn });
            this.labelValues.push({ label: 'Name', valueHtml: this.service.name });
            this.labelValues.push({ label: 'Permissions', valueHtml: this.service.permissions });
            this.labelValues.push({ label: 'Certificate domain name', valueHtml: this.service.certDomainName });
            if (this.service.oidcRedirectUri) {
                this.labelValues.push({ label: 'OIDC Redirect URI', valueHtml: this.service.oidcRedirectUri });
            }
            if (this.service.oidcClientId) {
                this.labelValues.push({ label: 'OIDC Client ID', valueHtml: this.service.oidcClientId });
            }
            if (this.service.oidcClientSecret) {
                this.labelValues.push({ label: 'OIDC Client Secret', valueHtml: this.service.oidcClientSecret });
            }
            if (this.service.oidcAccessType) {
                this.labelValues.push({ label: 'Access type', valueHtml: ServiceViewModel_1.ServiceViewModel.getLabelForEnum(this.service.oidcAccessType) });
            }
            this.generateLabelValueForVessel();
            this.generateLabelValueForInstance();
        }
    };
    ServiceDetailsViewComponent.prototype.generateLabelValueForVessel = function () {
        var vessel = this.service.vessel;
        if (vessel) {
            var label = 'Linked vessel';
            this.labelValues.push({ label: label, valueHtml: vessel.name, linkFunction: this.onGotoVessel, linkValue: [vessel.mrn] });
        }
    };
    ServiceDetailsViewComponent.prototype.generateLabelValueForInstance = function () {
        if (this.shouldShowLinkToInstance && this.linkToInstance) {
            var label = 'Linked Instance';
            this.labelValues.push({ label: label, valueHtml: this.service.name, linkFunction: this.onGotoInstance, linkValue: [this.service.mrn, this.service.instanceVersion] });
        }
    };
    ServiceDetailsViewComponent.prototype.showDelete = function () {
        return this.shouldShowDelete && this.isAdmin() && this.service != null;
    };
    ServiceDetailsViewComponent.prototype.showUpdate = function () {
        return this.shouldShowUpdate && this.isAdmin() && this.service != null;
    };
    ServiceDetailsViewComponent.prototype.isAdmin = function () {
        return this.authService.authState.hasPermission(auth_service_1.AuthPermission.ServiceAdmin);
    };
    ServiceDetailsViewComponent.prototype.delete = function () {
        this.deleteAction.emit('');
    };
    ServiceDetailsViewComponent.prototype.update = function () {
        this.updateAction.emit('');
    };
    ServiceDetailsViewComponent.prototype.gotoInstance = function (linkValue) {
        try {
            this.navigationHelperService.navigateToOrgInstance(linkValue[0], linkValue[1]);
        }
        catch (error) {
            this.notifications.generateNotification('Error', 'Error when trying to go to instance', mc_notifications_service_1.MCNotificationType.Error, error);
        }
    };
    ServiceDetailsViewComponent.prototype.gotoVessel = function (linkValue) {
        try {
            this.navigationHelperService.navigateToVessel(linkValue[0]);
        }
        catch (error) {
            this.notifications.generateNotification('Error', 'Error when trying to go to vessel', mc_notifications_service_1.MCNotificationType.Error, error);
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', (typeof (_a = typeof Service_1.Service !== 'undefined' && Service_1.Service) === 'function' && _a) || Object)
    ], ServiceDetailsViewComponent.prototype, "service", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ServiceDetailsViewComponent.prototype, "shouldShowDelete", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ServiceDetailsViewComponent.prototype, "shouldShowUpdate", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ServiceDetailsViewComponent.prototype, "shouldShowLinkToInstance", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ServiceDetailsViewComponent.prototype, "isLoading", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ServiceDetailsViewComponent.prototype, "title", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', (typeof (_b = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _b) || Object)
    ], ServiceDetailsViewComponent.prototype, "deleteAction", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', (typeof (_c = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _c) || Object)
    ], ServiceDetailsViewComponent.prototype, "updateAction", void 0);
    ServiceDetailsViewComponent = __decorate([
        core_1.Component({
            selector: 'service-details-view',
            encapsulation: core_1.ViewEncapsulation.None,
            template: __webpack_require__("./src/app/pages/shared/components/service-details-view/service-details-view.html"),
            styles: []
        }), 
        __metadata('design:paramtypes', [(typeof (_d = typeof file_helper_service_1.FileHelperService !== 'undefined' && file_helper_service_1.FileHelperService) === 'function' && _d) || Object, (typeof (_e = typeof auth_service_1.AuthService !== 'undefined' && auth_service_1.AuthService) === 'function' && _e) || Object, (typeof (_f = typeof id_services_service_1.IdServicesService !== 'undefined' && id_services_service_1.IdServicesService) === 'function' && _f) || Object, (typeof (_g = typeof mc_notifications_service_1.MCNotificationsService !== 'undefined' && mc_notifications_service_1.MCNotificationsService) === 'function' && _g) || Object, (typeof (_h = typeof navigation_helper_service_1.NavigationHelperService !== 'undefined' && navigation_helper_service_1.NavigationHelperService) === 'function' && _h) || Object, (typeof (_j = typeof instances_service_1.InstancesService !== 'undefined' && instances_service_1.InstancesService) === 'function' && _j) || Object])
    ], ServiceDetailsViewComponent);
    return ServiceDetailsViewComponent;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
}());
exports.ServiceDetailsViewComponent = ServiceDetailsViewComponent;


/***/ },

/***/ "./src/app/pages/shared/components/service-details-view/service-details-view.html":
/***/ function(module, exports) {

module.exports = "<ba-card title=\"{{title}}\" baCardClass=\"with-scroll table-panel\">\n  <mc-label-value-table [isLoading]=\"isLoading || isLoadingInstance\" [labelValues]=\"labelValues\"></mc-label-value-table>\n  <ul *ngIf=\"!isLoading && service && (showDownload() || showDelete() || showUpdate())\" class=\"btn-list clearfix\">\n    <li *ngIf=\"showDownload()\">\n      <button type=\"button\" class=\"btn btn-primary btn-raised\" (click)=\"downloadXML()\">Download JBOSS XML</button>\n    </li>\n    <li *ngIf=\"showDownload()\">\n      <button type=\"button\" class=\"btn btn-primary btn-raised\" (click)=\"downloadJSON()\">Download Keycloak JSON</button>\n    </li>\n    <li *ngIf=\"showUpdate()\">\n      <button type=\"button\" class=\"btn btn-primary btn-raised\" (click)=\"update()\">Update</button>\n    </li>\n    <li *ngIf=\"showDelete()\">\n      <button type=\"button\" class=\"btn btn-danger btn-raised\" (click)=\"delete()\">Delete Service</button>\n    </li>\n  </ul>\n</ba-card>\n\n<div *ngIf=\"service\">\n  <ba-card title=\"Certificates for {{service.name}}\" baCardClass=\"with-scroll table-panel\">\n    <certificates-table [isAdmin]=\"isAdmin()\" [entityMrn]=\"entityMrn\" [isLoading]=\"isLoading\" [certificateTitle]=\"service.name\" [certificateEntityType]=\"entityType\" [certificates]=\"service.certificates\"></certificates-table>\n  </ba-card>\n</div>"

/***/ },

/***/ "./src/app/pages/shared/components/service-registry-search/service-registry-search.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var mc_notifications_service_1 = __webpack_require__("./src/app/shared/mc-notifications.service.ts");
var organizations_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/organizations.service.ts");
var forms_1 = __webpack_require__("./node_modules/@angular/forms/index.js");
var auth_service_1 = __webpack_require__("./src/app/authentication/services/auth.service.ts");
var sr_search_requests_service_1 = __webpack_require__("./src/app/pages/org-service-registry/shared/services/sr-search-requests.service.ts");
var app_constants_1 = __webpack_require__("./src/app/shared/app.constants.ts");
var ServiceRegistrySearchComponent = (function () {
    function ServiceRegistrySearchComponent(searchRequestsService, changeDetector, authService, formBuilder, orgsService, notifications) {
        this.searchRequestsService = searchRequestsService;
        this.changeDetector = changeDetector;
        this.authService = authService;
        this.orgsService = orgsService;
        this.notifications = notifications;
        this.showKeywords = true;
        this.onSearch = new core_1.EventEmitter();
        this.endorsementMainSwitch = app_constants_1.SHOW_ENDORSEMENTS;
        this.formGroup = formBuilder.group({});
    }
    ServiceRegistrySearchComponent.prototype.ngOnDestroy = function () {
        this.changeDetector.detach();
    };
    ServiceRegistrySearchComponent.prototype.ngOnInit = function () {
        this.onSearchFunction = this.search.bind(this);
        this.isCollapsed = false;
        this.setClass();
        this.isLoading = true;
        this.generateForm();
        this.loadOrganizations();
    };
    ServiceRegistrySearchComponent.prototype.toggle = function () {
        this.isCollapsed = !this.isCollapsed;
        this.setClass();
    };
    ServiceRegistrySearchComponent.prototype.setClass = function () {
        this.toggleClass = this.isCollapsed ? 'fa fa-caret-square-o-down' : 'fa fa-caret-square-o-up';
    };
    ServiceRegistrySearchComponent.prototype.search = function () {
        var keywords = this.formGroup.value.keywords;
        var endorsedBy;
        var registeredBy;
        var registeredByValue = this.formGroup.value.registeredBy;
        if (registeredByValue && registeredByValue.toLowerCase().indexOf('undefined') < 0) {
            registeredBy = registeredByValue;
        }
        var endorsedByValue = this.formGroup.value.endorsedBy;
        if (endorsedByValue && endorsedByValue.toLowerCase().indexOf('undefined') < 0) {
            endorsedBy = endorsedByValue;
        }
        this.doSearch(keywords, registeredBy, endorsedBy);
    };
    ServiceRegistrySearchComponent.prototype.searchFromRegisteredBy = function (registeredBy) {
        var keywords = this.formGroup.value.keywords;
        var endorsedBy;
        if (registeredBy && registeredBy.toLowerCase().indexOf('undefined') > -1) {
            registeredBy = undefined;
        }
        var endorsedByValue = this.formGroup.value.endorsedBy;
        if (endorsedByValue && endorsedByValue.toLowerCase().indexOf('undefined') < 0) {
            endorsedBy = endorsedByValue;
        }
        this.doSearch(keywords, registeredBy, endorsedBy);
    };
    ServiceRegistrySearchComponent.prototype.searchFromEndorsedBy = function (endorsedBy) {
        var keywords = this.formGroup.value.keywords;
        var registeredBy;
        var registeredByValue = this.formGroup.value.registeredBy;
        if (registeredByValue && registeredByValue.toLowerCase().indexOf('undefined') < 0) {
            registeredBy = registeredByValue;
        }
        if (endorsedBy && endorsedBy.toLowerCase().indexOf('undefined') > -1) {
            endorsedBy = undefined;
        }
        this.doSearch(keywords, registeredBy, endorsedBy);
    };
    ServiceRegistrySearchComponent.prototype.doSearch = function (keywords, registeredBy, endorsedBy) {
        var searchRequest = { keywords: keywords, registeredBy: registeredBy, endorsedBy: endorsedBy };
        this.searchRequestsService.addSearchRequest(this.searchKey, searchRequest);
        this.notifications.errorLog = null; // Remove error log if it is present
        this.onSearch.emit(searchRequest);
    };
    ServiceRegistrySearchComponent.prototype.generateForm = function () {
        var formControl = new forms_1.FormControl('');
        this.formGroup.addControl('keywords', formControl);
        formControl = new forms_1.FormControl(undefined);
        this.formGroup.addControl('registeredBy', formControl);
        formControl = new forms_1.FormControl(undefined);
        this.formGroup.addControl('endorsedBy', formControl);
    };
    ServiceRegistrySearchComponent.prototype.loadOrganizations = function () {
        var _this = this;
        this.orgsService.getAllOrganizations().subscribe(function (organizations) {
            _this.setupSearchRequest(organizations);
            _this.isLoading = false;
        }, function (err) {
            _this.setupSearchRequest([]);
            _this.isLoading = false;
            _this.notifications.generateNotification('Error', 'Error when trying to get organizations', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    ServiceRegistrySearchComponent.prototype.setupSearchRequest = function (organizations) {
        var _this = this;
        this.selectValuesOrganizations = [];
        this.selectValuesOrganizations.push({ value: undefined, label: 'All' });
        this.selectValuesOrganizationsForEndorsement = [];
        this.selectValuesOrganizationsForEndorsement.push({ value: undefined, label: 'No filter' });
        organizations.forEach(function (organization) {
            _this.selectValuesOrganizations.push({ value: organization.mrn, label: organization.name });
            _this.selectValuesOrganizationsForEndorsement.push({ value: organization.mrn, label: organization.name });
        });
        var registeredBy;
        var endorsedBy;
        var keywords = '';
        var searchRequest = this.searchRequestsService.getSearchRequest(this.searchKey);
        if (searchRequest) {
            registeredBy = searchRequest.registeredBy;
            endorsedBy = searchRequest.endorsedBy;
            if (searchRequest.keywords) {
                keywords = searchRequest.keywords;
            }
        }
        else if (this.preFilterMyOrg) {
            registeredBy = this.authService.authState.orgMrn;
        }
        this.formGroup.patchValue({ registeredBy: registeredBy });
        this.formGroup.patchValue({ endorsedBy: endorsedBy });
        this.formGroup.patchValue({ keywords: keywords });
        this.formGroup.controls['registeredBy'].valueChanges.subscribe(function (param) { return _this.searchFromRegisteredBy(param); });
        this.formGroup.controls['endorsedBy'].valueChanges.subscribe(function (param) { return _this.searchFromEndorsedBy(param); });
        this.changeDetector.detectChanges();
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ServiceRegistrySearchComponent.prototype, "searchTitle", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ServiceRegistrySearchComponent.prototype, "searchKey", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ServiceRegistrySearchComponent.prototype, "isSearching", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ServiceRegistrySearchComponent.prototype, "preFilterMyOrg", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ServiceRegistrySearchComponent.prototype, "showEndorsement", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ServiceRegistrySearchComponent.prototype, "showKeywords", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', (typeof (_a = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _a) || Object)
    ], ServiceRegistrySearchComponent.prototype, "onSearch", void 0);
    ServiceRegistrySearchComponent = __decorate([
        core_1.Component({
            selector: 'service-registry-search',
            encapsulation: core_1.ViewEncapsulation.None,
            template: __webpack_require__("./src/app/pages/shared/components/service-registry-search/service-registry-search.html"),
            styles: [__webpack_require__("./src/app/pages/shared/components/service-registry-search/service-registry-search.scss")]
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof sr_search_requests_service_1.SrSearchRequestsService !== 'undefined' && sr_search_requests_service_1.SrSearchRequestsService) === 'function' && _b) || Object, (typeof (_c = typeof core_1.ChangeDetectorRef !== 'undefined' && core_1.ChangeDetectorRef) === 'function' && _c) || Object, (typeof (_d = typeof auth_service_1.AuthService !== 'undefined' && auth_service_1.AuthService) === 'function' && _d) || Object, (typeof (_e = typeof forms_1.FormBuilder !== 'undefined' && forms_1.FormBuilder) === 'function' && _e) || Object, (typeof (_f = typeof organizations_service_1.OrganizationsService !== 'undefined' && organizations_service_1.OrganizationsService) === 'function' && _f) || Object, (typeof (_g = typeof mc_notifications_service_1.MCNotificationsService !== 'undefined' && mc_notifications_service_1.MCNotificationsService) === 'function' && _g) || Object])
    ], ServiceRegistrySearchComponent);
    return ServiceRegistrySearchComponent;
    var _a, _b, _c, _d, _e, _f, _g;
}());
exports.ServiceRegistrySearchComponent = ServiceRegistrySearchComponent;


/***/ },

/***/ "./src/app/pages/shared/components/service-registry-search/service-registry-search.html":
/***/ function(module, exports) {

module.exports = "<a class=\"search-link\" (click)=\"toggle()\">\n  <h4>{{searchTitle}} <i style=\"margin-left:2px;color: white; font-size: 16px;\" class=\"{{toggleClass}}\" aria-hidden=\"true\"></i></h4>\n</a>\n<div class=\"mc-form-group\" style=\"margin-bottom: 0px !important;\" *ngIf=\"!isCollapsed && !isLoading && formGroup\">\n  <form [formGroup]=\"formGroup\">\n    <div *ngIf=\"showKeywords\" class=\"row\">\n      <div class=\"col-sm-12\">\n        <div [formGroup]=\"formGroup\" class=\"form-group mc-form-group\">\n          <label class=\"mc-form-label\">Keywords\n            <div class=\"input-group\">\n              <input type=\"text\" class=\"form-control mc-form-control\" formControlName=\"keywords\">\n              <span class=\"mc-form-control-input-group-btn input-group-btn\">\n                <mc-loading-button [type]=\"'submit'\" [class]=\"'btn btn-primary search-button'\" [isLoading]=\"isSearching\" [title]=\"'Search'\" [onClick]=\"onSearchFunction\" ></mc-loading-button>\n              </span>\n            </div>\n          </label>\n        </div>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col-sm-6\">\n        <div [formGroup]=\"formGroup\" class=\"form-group mc-form-group\" style=\"margin-bottom: 0px !important;\">\n          <label class=\"mc-form-label\">Registered by\n            <select class=\"form-control mc-form-control mc-form-control-select\" formControlName=\"registeredBy\">\n              <option *ngFor=\"let selectValue of selectValuesOrganizations\" [ngValue]=\"selectValue.value\">\n                {{selectValue.label}}\n              </option>\n            </select>\n          </label>\n        </div>\n      </div>\n      <div *ngIf=\"showEndorsement && endorsementMainSwitch\" class=\"col-sm-6\">\n        <div [formGroup]=\"formGroup\" class=\"form-group mc-form-group\" style=\"margin-bottom: 0px !important;\">\n          <label class=\"mc-form-label\">Endorsed by\n            <select class=\"form-control mc-form-control mc-form-control-select\" formControlName=\"endorsedBy\">\n              <option *ngFor=\"let selectValue of selectValuesOrganizationsForEndorsement\" [ngValue]=\"selectValue.value\">\n                {{selectValue.label}}\n              </option>\n            </select>\n          </label>\n        </div>\n      </div>\n    </div>\n  </form>\n</div>\n<div *ngIf=\"!isCollapsed\">\n  <sk-fading-circle [isRunning]=\"isLoading\" ></sk-fading-circle>\n</div>\n"

/***/ },

/***/ "./src/app/pages/shared/components/service-registry-search/service-registry-search.scss":
/***/ function(module, exports) {

module.exports = ".mc-form-label {\n  width: 100%; }\n\n.mc-form-control {\n  margin-top: 5px; }\n\n.mc-form-control:read-only {\n  cursor: not-allowed;\n  color: rgba(255, 255, 255, 0.7); }\n\n.mc-form-control-success {\n  border: 1px solid #8bd22f !important; }\n  .mc-form-control-success:focus {\n    border: 1px solid #aee06d !important; }\n\n.mc-form-control-error {\n  border: 1px solid #f95372 !important; }\n  .mc-form-control-error:focus {\n    border: 1px solid #fb879c !important; }\n\n.mc-form-group {\n  max-width: 450px;\n  margin-bottom: 0.5rem !important; }\n\n.mc-form-control-feedback {\n  top: 20px !important;\n  right: 10px !important; }\n\n.mc-form-control-select:read-only {\n  cursor: default !important;\n  color: #ffffff !important; }\n\n.search-link {\n  cursor: pointer;\n  color: #ffffff; }\n  .search-link:hover {\n    transform: none;\n    color: #ffffff; }\n\n.mc-form-control-input-group-btn {\n  padding-top: 5px; }\n\n.search-button {\n  border-bottom-left-radius: 0 !important;\n  border-top-left-radius: 0 !important; }\n  .search-button:hover {\n    transform: none; }\n\n.input-group {\n  margin-bottom: 0px !important; }\n"

/***/ },

/***/ "./src/app/pages/shared/components/services-table/services-table.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var mc_notifications_service_1 = __webpack_require__("./src/app/shared/mc-notifications.service.ts");
var instances_service_1 = __webpack_require__("./src/app/backend-api/service-registry/services/instances.service.ts");
var bug_reporting_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/bug-reporting.service.ts");
var organizations_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/organizations.service.ts");
var navigation_helper_service_1 = __webpack_require__("./src/app/shared/navigation-helper.service.ts");
var ServicesTableComponent = (function () {
    function ServicesTableComponent(navigationHelperService, orgsService, notifications, instancesService, bugService) {
        this.navigationHelperService = navigationHelperService;
        this.orgsService = orgsService;
        this.notifications = notifications;
        this.instancesService = instancesService;
        this.bugService = bugService;
    }
    ServicesTableComponent.prototype.ngOnInit = function () {
        this.onRowClick = this.gotoService.bind(this);
    };
    ServicesTableComponent.prototype.ngOnChanges = function () {
        if (this.services) {
            this.loadMyOrganization();
        }
    };
    ServicesTableComponent.prototype.loadMyOrganization = function () {
        var _this = this;
        this.orgsService.getMyOrganization().subscribe(function (organization) {
            _this.generateHeadersAndRows(organization.mrn);
        }, function (err) {
            _this.notifications.generateNotification('Error', 'Error when trying to get organization', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    ServicesTableComponent.prototype.generateHeadersAndRows = function (orgMrn) {
        var tableHeaders = [];
        var tableRows = [];
        var tableHeader = { title: 'Name', class: '' };
        tableHeaders.push(tableHeader);
        tableHeader = { title: 'Version', class: 'nowrap align-center' };
        tableHeaders.push(tableHeader);
        tableHeader = { title: 'Organization', class: 'nowrap' };
        tableHeaders.push(tableHeader);
        for (var _i = 0, _a = this.services; _i < _a.length; _i++) {
            var service = _a[_i];
            var cells = [];
            var tableCell = { valueHtml: service.name, class: '', truncateNumber: 250 };
            cells.push(tableCell);
            tableCell = { valueHtml: service.instanceVersion, class: 'nowrap align-center', truncateNumber: 0 };
            cells.push(tableCell);
            tableCell = { valueHtml: '', class: 'nowrap', truncateNumber: 30 };
            this.setOrganizationCell(tableCell, orgMrn);
            cells.push(tableCell);
            var tableRow = { cells: cells };
            tableRows.push(tableRow);
        }
        this.tableHeaders = tableHeaders;
        this.tableRows = tableRows;
    };
    ServicesTableComponent.prototype.setOrganizationCell = function (tableCell, organizationId) {
        var _this = this;
        this.orgsService.getOrganizationName(organizationId).subscribe(function (organizationName) {
            tableCell.valueHtml = organizationName;
        }, function (err) {
            _this.notifications.generateNotification('Error', 'Error when trying to get organization', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    ServicesTableComponent.prototype.gotoService = function (index) {
        var _this = this;
        var mrn = this.services[index].mrn;
        var version = this.services[index].instanceVersion;
        this.isLoading = true;
        this.instancesService.getInstance(mrn, version).subscribe(function (instance) {
            _this.navigationHelperService.navigateToOrgInstance(mrn, version);
        }, function (err) {
            if (err.status == 404) {
                // when using the portal only to register instances, this should never happen. However, if someone uses the SR api only then there might be something missing. We log it for further investigation
                var bugReport = { subject: "Missing instance", description: "There is a service in the IR that doesn't exist in the SR.\n\n MRN: " + mrn + ",\nVersion: " + version };
                _this.bugService.reportBug(bugReport);
            }
            _this.navigationHelperService.navigateToOrgInstance(mrn, version);
        });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ServicesTableComponent.prototype, "services", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ServicesTableComponent.prototype, "isLoading", void 0);
    ServicesTableComponent = __decorate([
        core_1.Component({
            selector: 'services-table',
            encapsulation: core_1.ViewEncapsulation.None,
            template: __webpack_require__("./src/app/pages/shared/components/services-table/services-table.html"),
            styles: []
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof navigation_helper_service_1.NavigationHelperService !== 'undefined' && navigation_helper_service_1.NavigationHelperService) === 'function' && _a) || Object, (typeof (_b = typeof organizations_service_1.OrganizationsService !== 'undefined' && organizations_service_1.OrganizationsService) === 'function' && _b) || Object, (typeof (_c = typeof mc_notifications_service_1.MCNotificationsService !== 'undefined' && mc_notifications_service_1.MCNotificationsService) === 'function' && _c) || Object, (typeof (_d = typeof instances_service_1.InstancesService !== 'undefined' && instances_service_1.InstancesService) === 'function' && _d) || Object, (typeof (_e = typeof bug_reporting_service_1.BugReportingService !== 'undefined' && bug_reporting_service_1.BugReportingService) === 'function' && _e) || Object])
    ], ServicesTableComponent);
    return ServicesTableComponent;
    var _a, _b, _c, _d, _e;
}());
exports.ServicesTableComponent = ServicesTableComponent;


/***/ },

/***/ "./src/app/pages/shared/components/services-table/services-table.html":
/***/ function(module, exports) {

module.exports = "<mc-table [tableHeaders]=\"tableHeaders\" [tableRows]=\"tableRows\" [isLoading]=\"isLoading\" [onRowClick]=\"onRowClick\"></mc-table>\n"

/***/ },

/***/ "./src/app/pages/shared/components/specifications-table/specifications-table.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var organizations_service_1 = __webpack_require__("./src/app/backend-api/identity-registry/services/organizations.service.ts");
var mc_notifications_service_1 = __webpack_require__("./src/app/shared/mc-notifications.service.ts");
var SpecificationsTableComponent = (function () {
    function SpecificationsTableComponent(orgsService, notifications) {
        this.orgsService = orgsService;
        this.notifications = notifications;
    }
    SpecificationsTableComponent.prototype.ngOnInit = function () {
    };
    SpecificationsTableComponent.prototype.ngOnChanges = function () {
        if (this.specifications) {
            this.generateHeadersAndRows();
        }
    };
    SpecificationsTableComponent.prototype.generateHeadersAndRows = function () {
        var tableHeaders = [];
        var tableRows = [];
        var tableHeader = { title: 'Name', class: '' };
        tableHeaders.push(tableHeader);
        tableHeader = { title: 'Version', class: 'nowrap align-center' };
        tableHeaders.push(tableHeader);
        tableHeader = { title: 'Status', class: 'nowrap' };
        tableHeaders.push(tableHeader);
        tableHeader = { title: 'Organization', class: 'nowrap' };
        tableHeaders.push(tableHeader);
        tableHeader = { title: 'Description', class: '' };
        tableHeaders.push(tableHeader);
        for (var _i = 0, _a = this.specifications; _i < _a.length; _i++) {
            var specification = _a[_i];
            var cells = [];
            var tableCell = { valueHtml: specification.name, class: '', truncateNumber: 50 };
            cells.push(tableCell);
            tableCell = { valueHtml: specification.version, class: 'nowrap align-center', truncateNumber: 0 };
            cells.push(tableCell);
            tableCell = { valueHtml: specification.status, class: 'nowrap', truncateNumber: 0 };
            cells.push(tableCell);
            tableCell = { valueHtml: '', class: 'nowrap', truncateNumber: 30 };
            this.setOrganizationCell(tableCell, specification.organizationId);
            cells.push(tableCell);
            tableCell = { valueHtml: specification.description, class: 'table-description', truncateNumber: 250 };
            cells.push(tableCell);
            var tableRow = { cells: cells };
            tableRows.push(tableRow);
        }
        this.tableHeaders = tableHeaders;
        this.tableRows = tableRows;
    };
    SpecificationsTableComponent.prototype.setOrganizationCell = function (tableCell, organizationId) {
        var _this = this;
        this.orgsService.getOrganizationName(organizationId).subscribe(function (organizationName) {
            tableCell.valueHtml = organizationName;
        }, function (err) {
            _this.notifications.generateNotification('Error', 'Error when trying to get organization', mc_notifications_service_1.MCNotificationType.Error, err);
        });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], SpecificationsTableComponent.prototype, "specifications", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], SpecificationsTableComponent.prototype, "isLoading", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Function)
    ], SpecificationsTableComponent.prototype, "onRowClick", void 0);
    SpecificationsTableComponent = __decorate([
        core_1.Component({
            selector: 'specifications-table',
            encapsulation: core_1.ViewEncapsulation.None,
            template: __webpack_require__("./src/app/pages/shared/components/specifications-table/specifications-table.html"),
            styles: []
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof organizations_service_1.OrganizationsService !== 'undefined' && organizations_service_1.OrganizationsService) === 'function' && _a) || Object, (typeof (_b = typeof mc_notifications_service_1.MCNotificationsService !== 'undefined' && mc_notifications_service_1.MCNotificationsService) === 'function' && _b) || Object])
    ], SpecificationsTableComponent);
    return SpecificationsTableComponent;
    var _a, _b;
}());
exports.SpecificationsTableComponent = SpecificationsTableComponent;


/***/ },

/***/ "./src/app/pages/shared/components/specifications-table/specifications-table.html":
/***/ function(module, exports) {

module.exports = "<mc-table [tableHeaders]=\"tableHeaders\" [tableRows]=\"tableRows\" [isLoading]=\"isLoading\" [onRowClick]=\"onRowClick\"></mc-table>\n"

/***/ },

/***/ "./src/app/pages/shared/services/organization-view-model.service.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var OrganizationViewModelService = (function () {
    function OrganizationViewModelService() {
    }
    OrganizationViewModelService.prototype.ngOnInit = function () {
    };
    OrganizationViewModelService.prototype.generateLabelValuesForOrganization = function (organization) {
        var labelValues = undefined;
        if (organization) {
            labelValues = [];
            labelValues.push({ label: 'MRN', valueHtml: organization.mrn });
            labelValues.push({ label: 'Name', valueHtml: organization.name });
            labelValues.push({ label: 'Address', valueHtml: organization.address });
            labelValues.push({ label: 'Country', valueHtml: organization.country });
            if (organization.email) {
                labelValues.push({ label: 'Email', valueHtml: "<a href='mailto:" + organization.email + "'>" + organization.email + "</a>" });
            }
            if (organization.url) {
                labelValues.push({ label: 'Website', valueHtml: "<a href='" + organization.url + "' target='_blank'>" + organization.url + "</a>" });
            }
        }
        return labelValues;
    };
    OrganizationViewModelService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], OrganizationViewModelService);
    return OrganizationViewModelService;
}());
exports.OrganizationViewModelService = OrganizationViewModelService;


/***/ },

/***/ "./src/app/pages/shared/services/vessel-helper.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var VesselAttribute_1 = __webpack_require__("./src/app/backend-api/identity-registry/autogen/model/VesselAttribute.ts");
var AttributeNameEnum = VesselAttribute_1.VesselAttribute.AttributeNameEnum;
var VesselHelper = (function () {
    function VesselHelper() {
    }
    VesselHelper.isVesselAttEqualTo = function (vessel, imoNumber, mmsiNumber) {
        imoNumber = imoNumber || '';
        mmsiNumber = mmsiNumber || '';
        return imoNumber === VesselHelper.getIMO(vessel) && mmsiNumber === VesselHelper.getMMSI(vessel);
    };
    VesselHelper.labelForSelect = function (vessel) {
        var imo = VesselHelper.getIMO(vessel);
        var mmsi = VesselHelper.getMMSI(vessel);
        return vessel.name + ", IMO:" + (imo.length == 0 ? ' - ' : imo) + ", MMSI:" + (mmsi.length == 0 ? ' - ' : mmsi);
    };
    // Returns empty string if no IMO exists for the vessel
    VesselHelper.getIMO = function (vessel) {
        var imo = '';
        vessel.attributes.forEach(function (att) {
            if (att.attributeName === AttributeNameEnum.ImoNumber) {
                imo = att.attributeValue;
            }
        });
        return imo;
    };
    // Returns empty string if no MMSI exists for the vessel
    VesselHelper.getMMSI = function (vessel) {
        var mmsi = '';
        vessel.attributes.forEach(function (att) {
            if (att.attributeName === AttributeNameEnum.MmsiNumber) {
                mmsi = att.attributeValue;
            }
        });
        return mmsi;
    };
    return VesselHelper;
}());
exports.VesselHelper = VesselHelper;


/***/ },

/***/ "./src/app/pages/shared/shared.module.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var common_1 = __webpack_require__("./node_modules/@angular/common/index.js");
var designs_table_component_1 = __webpack_require__("./src/app/pages/shared/components/designs-table/designs-table.component.ts");
var specifications_table_component_1 = __webpack_require__("./src/app/pages/shared/components/specifications-table/specifications-table.component.ts");
var nga_module_1 = __webpack_require__("./src/app/theme/nga.module.ts");
var instances_table_component_1 = __webpack_require__("./src/app/pages/shared/components/instances-table/instances-table.component.ts");
var sr_view_model_service_1 = __webpack_require__("./src/app/pages/org-service-registry/shared/services/sr-view-model.service.ts");
var certificates_table_component_1 = __webpack_require__("./src/app/pages/shared/components/certificates-table/certificates-table.component.ts");
var certificate_helper_service_1 = __webpack_require__("./src/app/pages/shared/services/certificate-helper.service.ts");
var organization_details_table_component_1 = __webpack_require__("./src/app/pages/shared/components/organizaton-details-table/organization-details-table.component.ts");
var organization_view_model_service_1 = __webpack_require__("./src/app/pages/shared/services/organization-view-model.service.ts");
var certificate_issue_new_component_1 = __webpack_require__("./src/app/pages/shared/components/certificate-issue-new/certificate-issue-new.component.ts");
var service_details_view_component_1 = __webpack_require__("./src/app/pages/shared/components/service-details-view/service-details-view.component.ts");
var certificate_revoke_component_1 = __webpack_require__("./src/app/pages/shared/components/certificate-revoke/certificate-revoke.component.ts");
var service_registry_search_component_1 = __webpack_require__("./src/app/pages/shared/components/service-registry-search/service-registry-search.component.ts");
var forms_1 = __webpack_require__("./node_modules/@angular/forms/index.js");
var sr_search_requests_service_1 = __webpack_require__("./src/app/pages/org-service-registry/shared/services/sr-search-requests.service.ts");
var endorsed_by_list_component_1 = __webpack_require__("./src/app/pages/shared/components/endorsed-by-list/endorsed-by-list.component.ts");
var services_table_component_1 = __webpack_require__("./src/app/pages/shared/components/services-table/services-table.component.ts");
var SharedModule = (function () {
    function SharedModule() {
    }
    SharedModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                nga_module_1.NgaModule,
                forms_1.ReactiveFormsModule
            ],
            declarations: [
                designs_table_component_1.DesignsTableComponent,
                instances_table_component_1.InstancesTableComponent,
                specifications_table_component_1.SpecificationsTableComponent,
                certificates_table_component_1.CertificatesTableComponent,
                organization_details_table_component_1.OrganizationDetailsTableComponent,
                certificate_issue_new_component_1.CertificateIssueNewComponent,
                certificate_revoke_component_1.CertificateRevokeComponent,
                service_details_view_component_1.ServiceDetailsViewComponent,
                service_registry_search_component_1.ServiceRegistrySearchComponent,
                endorsed_by_list_component_1.EndorsedByListComponent,
                services_table_component_1.ServicesTableComponent
            ],
            exports: [
                organization_details_table_component_1.OrganizationDetailsTableComponent,
                designs_table_component_1.DesignsTableComponent,
                instances_table_component_1.InstancesTableComponent,
                specifications_table_component_1.SpecificationsTableComponent,
                certificates_table_component_1.CertificatesTableComponent,
                certificate_issue_new_component_1.CertificateIssueNewComponent,
                certificate_revoke_component_1.CertificateRevokeComponent,
                service_details_view_component_1.ServiceDetailsViewComponent,
                service_registry_search_component_1.ServiceRegistrySearchComponent,
                endorsed_by_list_component_1.EndorsedByListComponent,
                services_table_component_1.ServicesTableComponent,
            ],
            providers: [
                sr_view_model_service_1.SrViewModelService,
                certificate_helper_service_1.CertificateHelperService,
                organization_view_model_service_1.OrganizationViewModelService,
                sr_search_requests_service_1.SrSearchRequestsService
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], SharedModule);
    return SharedModule;
}());
exports.SharedModule = SharedModule;


/***/ }

});
//# sourceMappingURL=1.dd5b96aa1bc5b91ee17b.map