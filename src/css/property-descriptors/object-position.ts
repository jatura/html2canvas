import {PropertyDescriptorParsingType, IPropertyListDescriptor} from '../IPropertyDescriptor';
import {CSSValue, parseFunctionArgs} from '../syntax/parser';
import {isLengthPercentage, LengthPercentageTuple, parseLengthPercentageTuple} from '../types/length-percentage';
import {Context} from '../../core/context';
export type ObjectPosition = LengthPercentageTuple;

export const objectPosition: IPropertyListDescriptor<ObjectPosition> = {
    name: 'object-position',
    initialValue: '50% 50%',
    type: PropertyDescriptorParsingType.LIST,
    prefix: false,
    parse: (_context: Context, tokens: CSSValue[]): ObjectPosition => {
        return parseFunctionArgs(tokens)
            .map((values: CSSValue[]) => values.filter(isLengthPercentage))
            .map(parseLengthPercentageTuple)[0];
    }
};