import postcss from 'postcss';
import test    from 'ava';

import plugin from './';

function run(t, input, output, opts = { }) {
    return postcss([ plugin(opts) ]).process(input)
        .then( result => {
            t.same(result.css, output);
            t.same(result.warnings().length, 0);
        });
}

test('filter out positioned elements', t => {
    return run(t,
        postcss.parse('.div { color: black; position: fixed; } .span { color: white; z-index: 1; }'),
        postcss.parse('.span { color: white; z-index: 1; }').toResult().css,
        { props: ['position'], exclude: true }
    );
});

test('keep only positioned elements', t => {
    return run(t,
        postcss.parse('.div { color: black; position: fixed; } .span { color: white; z-index: 1; }'),
        postcss.parse('.div { color: black; position: fixed; }').toResult().css,
        { props: ['position'] }
    );
});

test('keep all elements if no excluded properties match', t => {
    return run(t,
        postcss.parse('.div { color: black; position: fixed; } .span { color: white; z-index: 1; }'),
        postcss.parse('.div { color: black; position: fixed; } .span { color: white; z-index: 1; }').toResult().css,
        { props: ['border-width'], exclude: true }
    );
});

test('keep all elements if no all have matching properties', t => {
    return run(t,
        postcss.parse('.div { color: black; position: fixed; } .span { color: white; z-index: 1; }'),
        postcss.parse('.div { color: black; position: fixed; } .span { color: white; z-index: 1; }').toResult().css,
        { props: ['z-index', 'position']}
    );
});

test('return empty if all rules are excluded', t => {
    return run(t,
        postcss.parse('.div { color: black; position: fixed; } .span { color: white; z-index: 1; }'),
        '',
        { props: ['color'], exclude: true }
    );
});

test('return empty if no rules match', t => {
    return run(t,
        postcss.parse('.div { color: black; position: fixed; } .span { color: white; z-index: 1; }'),
        '',
        { props: ['border-width'] }
    );
});
