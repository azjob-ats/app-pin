import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiResponse, ErrorType } from '@shared/interfaces/base/api-response';
import { List } from '@shared/interfaces/base/pages-total-records';
import {
  AddMembersToGroupRequest,
  CreateGroupRequest,
  CreateRoleRequest,
  InviteMemberRequest,
  UpdateGroupRequest,
  UpdateMemberRequest,
  UpdateRoleRequest,
} from '@shared/interfaces/dto/request/empresa-member';
import {
  GroupResponse,
  MemberListResponse,
  MemberResponse,
  RoleResponse,
} from '@shared/interfaces/dto/response/empresa-member';
import { Group, Member, Role } from '@shared/interfaces/entity/empresa-member';
import { MemberMap } from '@shared/maps/empresa-member.map';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmpresaMemberApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.API_BASE_URL;

  public listMembers(slug: string): Observable<ApiResponse<List<Member[]>>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.MEMBERS_LIST.replace(':slug', slug)}`;
    return this.http.get<ApiResponse<MemberListResponse>>(url).pipe(
      map((response) => ({
        ...response,
        data: response.data ? MemberMap.toList(response.data) : undefined,
      })),
      catchError(this.handleError('empresa/members/list')),
    );
  }

  public invite(
    slug: string,
    request: InviteMemberRequest,
  ): Observable<ApiResponse<Member>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.MEMBER_INVITE.replace(':slug', slug)}`;
    return this.http.post<ApiResponse<MemberResponse>>(url, request).pipe(
      map((response) => ({
        ...response,
        data: response.data ? MemberMap.toMember(response.data) : undefined,
      })),
      catchError(this.handleError('empresa/members/invite')),
    );
  }

  public updateMember(
    slug: string,
    id: string,
    request: UpdateMemberRequest,
  ): Observable<ApiResponse<Member>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.MEMBER_UPDATE.replace(':slug', slug).replace(':id', id)}`;
    return this.http.patch<ApiResponse<MemberResponse>>(url, request).pipe(
      map((response) => ({
        ...response,
        data: response.data ? MemberMap.toMember(response.data) : undefined,
      })),
      catchError(this.handleError('empresa/members/update')),
    );
  }

  public listRoles(slug: string): Observable<ApiResponse<Role[]>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.ROLES_LIST.replace(':slug', slug)}`;
    return this.http.get<ApiResponse<RoleResponse[]>>(url).pipe(
      map((response) => ({
        ...response,
        data: response.data ? response.data.map((r) => MemberMap.toRole(r)) : undefined,
      })),
      catchError(this.handleError('empresa/roles/list')),
    );
  }

  public createRole(
    slug: string,
    request: CreateRoleRequest,
  ): Observable<ApiResponse<Role>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.ROLE_CREATE.replace(':slug', slug)}`;
    return this.http.post<ApiResponse<RoleResponse>>(url, request).pipe(
      map((response) => ({
        ...response,
        data: response.data ? MemberMap.toRole(response.data) : undefined,
      })),
      catchError(this.handleError('empresa/roles/create')),
    );
  }

  public updateRole(
    slug: string,
    id: string,
    request: UpdateRoleRequest,
  ): Observable<ApiResponse<Role>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.ROLE_UPDATE.replace(':slug', slug).replace(':id', id)}`;
    return this.http.patch<ApiResponse<RoleResponse>>(url, request).pipe(
      map((response) => ({
        ...response,
        data: response.data ? MemberMap.toRole(response.data) : undefined,
      })),
      catchError(this.handleError('empresa/roles/update')),
    );
  }

  public listGroups(slug: string): Observable<ApiResponse<Group[]>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.GROUPS_LIST.replace(':slug', slug)}`;
    return this.http.get<ApiResponse<GroupResponse[]>>(url).pipe(
      map((response) => ({
        ...response,
        data: response.data ? response.data.map((g) => MemberMap.toGroup(g)) : undefined,
      })),
      catchError(this.handleError('empresa/groups/list')),
    );
  }

  public createGroup(
    slug: string,
    request: CreateGroupRequest,
  ): Observable<ApiResponse<Group>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.GROUP_CREATE.replace(':slug', slug)}`;
    return this.http.post<ApiResponse<GroupResponse>>(url, request).pipe(
      map((response) => ({
        ...response,
        data: response.data ? MemberMap.toGroup(response.data) : undefined,
      })),
      catchError(this.handleError('empresa/groups/create')),
    );
  }

  public updateGroup(
    slug: string,
    id: string,
    request: UpdateGroupRequest,
  ): Observable<ApiResponse<Group>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.GROUP_UPDATE.replace(':slug', slug).replace(':id', id)}`;
    return this.http.patch<ApiResponse<GroupResponse>>(url, request).pipe(
      map((response) => ({
        ...response,
        data: response.data ? MemberMap.toGroup(response.data) : undefined,
      })),
      catchError(this.handleError('empresa/groups/update')),
    );
  }

  public addMembersToGroup(
    slug: string,
    id: string,
    request: AddMembersToGroupRequest,
  ): Observable<ApiResponse<Group>> {
    const url = `${this.baseUrl}${environment.API.EMPRESA.GROUP_ADD_MEMBERS.replace(':slug', slug).replace(':id', id)}`;
    return this.http.post<ApiResponse<GroupResponse>>(url, request).pipe(
      map((response) => ({
        ...response,
        data: response.data ? MemberMap.toGroup(response.data) : undefined,
      })),
      catchError(this.handleError('empresa/groups/add-members')),
    );
  }

  private handleError(code: string) {
    return (err: unknown): Observable<never> => {
      const isHttp = err instanceof HttpErrorResponse;
      const response: ApiResponse = {
        success: false,
        message: isHttp ? err.message : 'Generic Error',
        statusCode: isHttp ? err.status : 500,
        errors: {
          code,
          message: isHttp ? err.statusText : 'Unknown error',
          type: isHttp ? ErrorType.HttpErrorResponse : ErrorType.genericError,
        },
        data: err,
        timestamp: new Date().toISOString(),
      };
      return throwError(() => response);
    };
  }
}
