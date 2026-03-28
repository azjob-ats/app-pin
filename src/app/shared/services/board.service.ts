import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Board } from '@shared/interfaces/entity/board';
import { BoardsApi } from '@shared/apis/boards.api';
import { UsersApi } from '@shared/apis/users.api';

@Injectable({ providedIn: 'root' })
export class BoardService {
  private readonly boardsApi = inject(BoardsApi);
  private readonly usersApi = inject(UsersApi);

  getUserBoards(userId: string): Observable<Board[]> {
    return this.usersApi.getBoards(userId).pipe(
      map((response) => response.data?.data ?? []),
    );
  }

  getBoardById(boardId: string): Observable<Board> {
    return this.boardsApi.getById(boardId).pipe(
      map((response) => response.data!),
    );
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
    return new Observable((observer) => {
      observer.next(newBoard);
      observer.complete();
    });
  }
}
