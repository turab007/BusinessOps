import { Component, OnInit } from '@angular/core';
import { menuArr } from 'modules/settings/menu'
import { LayoutService } from 'modules/layout';
import { PermissionService, RoleService, Role, Permission, RolePermissionService, } from '../../';
import {WorkspaceService,WorkSpace} from '../../../workspace'
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";

@Component({
  selector: 'app-managePermissions',
  templateUrl: './managePermissions.component.html',
  styleUrls: ['./managePermissions.component.css'],
  providers: [PermissionService, RoleService, RolePermissionService,WorkspaceService]
})
export class ManagePermissionsComponent implements OnInit {

  constructor(private _menuService: LayoutService,
    private _permissonSerivce: PermissionService,
    private _roleService: RoleService,
    private _rolePermissionService: RolePermissionService,
    private _workspaceService: WorkspaceService,
    private fb: FormBuilder) { }

  public roles: Role[];
  public searchRoleForm: FormGroup;
  public permissions: Permission[];
  public permissionList: Permission[];
  public allPermission: any[] = [];
  public workspaces:WorkSpace[];
  private currentRole: Role;
  private currentWs:WorkSpace;


  ngOnInit() {
    this._menuService.setMenu(menuArr);
    this.createFormControls();
    this.setBreadCrumbs();
    this.getRoles();
    this.getNotPersonalWS();

    // this._permissonSerivce.index().subscribe(perms => {
    //   console.log("permissions", perms);
    // })
  }

  createFormControls() {
    this.searchRoleForm = this.fb.group({
      role: ['', Validators.required],
      ws:['',Validators.required]
    });
  }


  getRoles() {
    this._roleService.index().subscribe(roles => {
      this.roles = roles;
      console.log('All fetched roles', roles);
    })
  }

  getNotPersonalWS()
  {
    this._workspaceService.index_not_personal().subscribe(ws=>
    {
      this.workspaces=(<any>ws).workSpaces;
      console.log("these are ws ",this.workspaces);
    })
    
  }


  /**
  * SETS BREADCRUMBS
  */
  setBreadCrumbs() {
    this._menuService.setBreadCrumb([
      { url: '/dashboard', title: 'Dashboard' },
      { title: 'Permissions' }
    ])
  }


  searchRolePermissions(isValid: Boolean, model) {
    if (isValid) {
      this.currentRole = model.role;
      this.currentWs=model.ws;
      console.log("this is role", model);
      this._rolePermissionService.getRolePermissions(model.role,this.currentWs).subscribe(perm => {
        this.permissions = perm;
        console.log("these are permissions", this.permissions);

        this._permissonSerivce.index().subscribe(permissionList => {
          this.permissionList = permissionList;
          this.getpermissionList();

          // thi                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
        })

        // let model={
        //   permissions:perm
        // }
        // 
        // this._rolePermissionService.getUnassignedPermissions(model).subscribe(res=>
        // {
        //   this.permissionList=res;
        //   console.log('all permissions',this.permissionList);
        // })
      })
    }

  }

  deletePermission(permission: Permission) {
    // console.log('user role',this.currentRole);
    let model = {
      _roleId: this.currentRole,
      _permId: permission._id

    }

    this._rolePermissionService.delete(model,this.currentWs).subscribe(res => {
      this.searchRolePermissions(this.searchRoleForm.valid, this.searchRoleForm.value);
    });


  }

  getpermissionList() {
    this.allPermission=[];
    this._permissonSerivce.index().subscribe(res => {
      this.permissionList = res;
      console.log('all permissions', res);


      for (let i = 0; i < this.permissionList.length; i++) {
        let isPresent = false;

        for (let j = 0; j < this.permissions.length; j++) {
          if (this.permissionList[i]._id == this.permissions[j]._id) {
            isPresent = true;
          }
        }

        this.allPermission.push({ permission: this.permissionList[i], selected: isPresent })
        isPresent = false;

      }

      console.log('all perms', this.allPermission);
    })
  }

  updatePermission(model,permission) {
    console.log("i am changed", model,permission);

    if (model) {
      let roleWsPermission = {
        module_id: permission.module_id,
        role_id: this.currentRole,
        permission_id: permission._id,
        workspace_id:this.currentWs
      }
      this._rolePermissionService.save(roleWsPermission,this.currentWs).subscribe(res => {
        console.log('added', res);
        this.searchRolePermissions(this.searchRoleForm.valid, this.searchRoleForm.value);
      })
    }

    else {
      let rolePermission = {
        _roleId: this.currentRole,
        _permId: permission._id

      }

      this._rolePermissionService.delete(rolePermission,this.currentWs).subscribe(res => {
        this.searchRolePermissions(this.searchRoleForm.valid, this.searchRoleForm.value);
      });
    }
  }

}
