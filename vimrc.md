---
layout: page
title: VIMRC
permalink: /vimrc/
---

```vimrc
set tabstop=4
set shiftwidth=4
set shiftround
"set expandtab
set autoindent
set smartindent
set hlsearch
set nu
"set paste

hi Search ctermbg=LightGreen
nmap :nohlsearch

"if has(‘syntax’) && (&t_Co > 2)
" syntax on
"endif

"colorscheme molokai
syntax on

autocmd BufNewFile,BufRead *.ja set filetype=php
autocmd BufNewFile,BufRead *.en set filetype=php
"autocmd BufNewFile,BufRead *.tx setfiletype xslate
autocmd BufNewFile,BufRead *.html if search(‘^: ‘) > 0 | set filetype=xslate | endif

" todoリストを簡単に入力する
abbreviate tl – [ ]

" 入れ子のリストを折りたたむ
"setlocal foldmethod=indent

" todoリストのon/offを切り替える
nnoremap :call ToggleCheckbox()

function! ToggleCheckbox()
let l:line = getline(‘.’)
if l:line =~ ‘\-\s\[\s\]’
let l:result = substitute(l:line, ‘-\s\[\s\]’, ‘- [x]’, ”)
call setline(‘.’, l:result)
elseif l:line =~ ‘\-\s\[x\]’
let l:result = substitute(l:line, ‘-\s\[x\]’, ‘- [ ]’, ”)
call setline(‘.’, l:result)
end
endfunction

"autocmd FileType php,ctp :set dictionary=~/.vim/dict/php.dict

hi Comment ctermfg=lightblue
hi perlComment ctermfg=darkgray
hi perlDATA ctermfg=cyan
hi perlPOD ctermfg=darkred
```
