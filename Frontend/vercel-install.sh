#!/bin/bash
pnpm config set node-linker hoisted
pnpm install --shamefully-hoist
