package com.quanyou.qup.demo.controller.app.v1;

import com.quanyou.qup.core.bean.base.ResponseEntity;
import com.quanyou.qup.demo.dto.DemoDTO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * Demo
 *
 * @author 抓抓匠
 * @since 2020-06-10
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/app/v2/demo")
@Api(tags = "Demo")
public class AppDemoController {

    @PostMapping
    @ApiOperation("新增")
    public ResponseEntity create(@Valid @RequestBody DemoDTO dto) {
        return ResponseEntity.success();
    }

    @PutMapping
    @ApiOperation("修改")
    public ResponseEntity update(@Valid @RequestBody DemoDTO dto) {
        return ResponseEntity.success();
    }

    @DeleteMapping("/{id}")
    @ApiOperation("删除")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id", value = "id", dataType = "String", paramType = "path", required = true)
    })
    public ResponseEntity delete(@PathVariable String id) {
        return ResponseEntity.success();
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "根据ID查询", httpMethod = "GET")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id", value = "id", dataType = "String", paramType = "path", required = true)
    })
    public ResponseEntity<DemoDTO> query(@PathVariable String id) {
        return ResponseEntity.success();
    }
}