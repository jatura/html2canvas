import {Bounds} from '../css/layout/bounds';
import {OBJECT_FIT} from '../css/property-descriptors/object-fit';
import {ObjectPosition} from '../css/property-descriptors/object-position';
import {getAbsoluteValue} from '../css/types/length-percentage';

export const calculateObjectFitBounds = (
    objectFit: OBJECT_FIT,
    objectPosition: ObjectPosition,
    naturalWidth: number,
    naturalHeight: number,
    clientWidth: number,
    clientHeight: number
): {src: Bounds; dest: Bounds} => {
    const naturalRatio = naturalWidth / naturalHeight;
    const clientRatio = clientWidth / clientHeight;

    const objectPositionX = getAbsoluteValue(objectPosition[0], 1);
    const objectPositionY = getAbsoluteValue(objectPosition[1] || objectPosition[0], 1);

    let srcX: number,
        srcY: number,
        srcWidth: number,
        srcHeight: number,
        destX: number,
        destY: number,
        destWidth: number,
        destHeight: number;

    if (objectFit === OBJECT_FIT.SCALE_DOWN) {
        objectFit =
            naturalWidth < clientWidth && naturalHeight < clientHeight
                ? OBJECT_FIT.NONE // src is smaller on both axes
                : OBJECT_FIT.CONTAIN; // at least one axis is greater or equal in size
    }

    switch (objectFit) {
        case OBJECT_FIT.CONTAIN:
            srcX = 0;
            srcY = 0;
            srcWidth = naturalWidth;
            srcHeight = naturalHeight;
            if (naturalRatio < clientRatio) {
                // snap to top/bottom
                destY = 0;
                destHeight = clientHeight;
                destWidth = destHeight * naturalRatio;
                destX = (clientWidth - destWidth) * objectPositionX;
            } else {
                // snap to left/right
                destX = 0;
                destWidth = clientWidth;
                destHeight = destWidth / naturalRatio;
                destY = (clientHeight - destHeight) * objectPositionY;
            }
            break;

        case OBJECT_FIT.COVER:
            destX = 0;
            destY = 0;
            destWidth = clientWidth;
            destHeight = clientHeight;
            if (naturalRatio < clientRatio) {
                // fill left/right
                srcX = 0;
                srcWidth = naturalWidth;
                srcHeight = clientHeight * (naturalWidth / clientWidth);
                srcY = (naturalHeight - srcHeight) * objectPositionY;
            } else {
                // fill top/bottom
                srcY = 0;
                srcHeight = naturalHeight;
                srcWidth = clientWidth * (naturalHeight / clientHeight);
                srcX = (naturalWidth - srcWidth) * objectPositionX;
            }
            break;

        case OBJECT_FIT.NONE:
            if (naturalWidth < clientWidth) {
                srcX = 0;
                srcWidth = naturalWidth;
                destX = (clientWidth - naturalWidth) * objectPositionX;
                destWidth = naturalWidth;
            } else {
                srcX = (naturalWidth - clientWidth) * objectPositionX;
                srcWidth = clientWidth;
                destX = 0;
                destWidth = clientWidth;
            }
            if (naturalHeight < clientHeight) {
                srcY = 0;
                srcHeight = naturalHeight;
                destY = (clientHeight - naturalHeight) * objectPositionY;
                destHeight = naturalHeight;
            } else {
                srcY =  (naturalHeight - clientHeight) * objectPositionY;
                srcHeight = clientHeight;
                destY = 0;
                destHeight = clientHeight;
            }
            break;

        case OBJECT_FIT.FILL:
        default:
            srcX = 0;
            srcY = 0;
            srcWidth = naturalWidth;
            srcHeight = naturalHeight;
            destX = 0;
            destY = 0;
            destWidth = clientWidth;
            destHeight = clientHeight;
            break;
    }

    return {
        src: new Bounds(srcX, srcY, srcWidth, srcHeight),
        dest: new Bounds(destX, destY, destWidth, destHeight)
    };
};