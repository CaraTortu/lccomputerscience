#!/bin/bash

# Start a new session named lccomputerscience and open neovim
tmux new -s lccomputerscience -d 
tmux rename-window -t lccomputerscience 'EDIT'
tmux send-keys -t lccomputerscience 'nvim .' C-m 

tmux new-window -t lccomputerscience
tmux rename-window -t lccomputerscience 'RUN'
tmux send-keys -t lccomputerscience 'bun run dev' C-m

tmux split-window -h -t lccomputerscience
tmux send-keys -t lccomputerscience 'stripe listen --forward-to localhost:3000/api/webhooks' C-m

tmux split-window -v -t lccomputerscience
tmux send-keys -t lccomputerscience 'bun run db:studio' C-m

tmux select-window -t lccomputerscience:1
tmux switch -t lccomputerscience

