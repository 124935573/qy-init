package com.quanyou.qup.demo.controller.api.v1;

import com.quanyou.qup.core.bean.base.ResponseEntity;
import com.quanyou.qup.core.bean.query.PageInfo;
import com.quanyou.qup.core.bean.query.Query;
import com.quanyou.qup.core.bean.query.QueryFactory;
import com.quanyou.qup.core.bean.query.QueryParams;
import com.quanyou.qup.core.util.ConvertUtil;
import com.quanyou.qup.demo.dto.DemoDTO;
import com.quanyou.qup.demo.entity.Demo;
import com.quanyou.qup.demo.service.DemoService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * Demo
 *
 * @author 抓抓匠
 * @since 2020-06-10
 */
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v2/demo")
@Api(tags = "Demo")
public class DemoController {
    private final DemoService demoService;

    @PostMapping("/page")
    @ApiOperation(value = "分页查询")
    public ResponseEntity<PageInfo<DemoDTO>> page(QueryParams queryParams) {
        Query query = QueryFactory.createQuery(queryParams);
        List<DemoDTO> list = demoService.queryByParams(query);
        PageInfo<DemoDTO> pageInfo = new PageInfo<>(query, list);
        return ResponseEntity.success(pageInfo);
    }

    @PostMapping
    @ApiOperation("新增")
    public ResponseEntity create(@Valid @RequestBody DemoDTO dto) {
        Demo demo = ConvertUtil.convertObject(Demo.class, dto);
        demoService.insert(demo);
        return ResponseEntity.success();
    }

    @PutMapping
    @ApiOperation("修改")
    public ResponseEntity update(@Valid @RequestBody DemoDTO dto) {
        Demo demo = ConvertUtil.convertObject(Demo.class, dto);
        demoService.update(demo);
        return ResponseEntity.success();
    }

    @DeleteMapping("/{id}")
    @ApiOperation("删除")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id", value = "id", dataType = "String", paramType = "path", required = true)
    })
    public ResponseEntity delete(@PathVariable String id) {
        demoService.deleteById(id);
        return ResponseEntity.success();
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "根据ID查询", httpMethod = "GET")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "id", value = "id", dataType = "String", paramType = "path", required = true)
    })
    public ResponseEntity<DemoDTO> query(@PathVariable String id) {
        return ResponseEntity.success(demoService.<DemoDTO>getById(id));
    }
}