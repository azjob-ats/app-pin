import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Board } from '@shared/interfaces/board.interface';
import { MOCK_BOARDS } from '@shared/mocks/boards.mock';

@Injectable({ providedIn: 'root' })
export class BoardService {
  getUserBoards(userId: string): Observable<Board[]> {
    return of(MOCK_BOARDS).pipe(delay(300));
  }

  getBoardById(boardId: string): Observable<Board> {
    const board = MOCK_BOARDS.find(b => b.id === boardId) ?? MOCK_BOARDS[0];
    return of(board).pipe(delay(300));
  }

  createBoard(name: string, description?: string): Observable<Board> {
    const newBoard: Board = {
      id: `board-${Date.now()}`,
      name,
      description,
      pinsCount: 0,
      owner: { id: 'current', username: 'myprofile', displayName: 'Meu Perfil' },
      createdAt: new Date().toISOString(),
    };
    return of(newBoard).pipe(delay(300));
  }
}
